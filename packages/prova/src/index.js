const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const { encode: encodeBlurhash } = require('blurhash');
const exifr = require('exifr');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const chalk = require('chalk');

const config = {
  inputDir: './original-images',
  outputDir: './optimized-images',
  qualities: { webp: 80, avif: 50, jpeg: 75 },
  sizes: [
    { suffix: '-lg', width: 1920 },
    { suffix: '-md', width: 1280 },
    { suffix: '-sm', width: 800 },
    { suffix: '-thumb', width: 300 },
  ],
  metadataFile: 'image-metadata.json',
  concurrency: 4,
  color: {
    numProminentColors: 2,
    dominantThreshold: 0.7,
    analysisResolution: 100, // Resize image to this width for color analysis
  },
};

// Color classification ranges
const COLOR_RANGES = { /* ... (keep previous values) ... */ };

// Initialize counters
let processedCount = 0;
let totalImages = 0;
const startTime = Date.now();

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const levels = {
    info: chalk.blue,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    debug: chalk.gray,
  };
  console.log(`${levels[level](`[${timestamp}]`)} ${message}`);
}

async function processImages() {
  if (!isMainThread) {
    // Worker thread logic
    const { filePaths, outputDir, config } = workerData;
    const metadata = {};

    // Process images concurrently within the worker
    await Promise.all(
      filePaths.map(async (filePath) => {
        const parsedPath = path.parse(path.relative(config.inputDir, filePath));
        const result = await processImage(filePath, outputDir, parsedPath, config);
        Object.assign(metadata, result);
      })
    );

    parentPort.postMessage(metadata);
    return;
  }

  // Main thread logic
  const metadata = {};
  const imagePaths = await getAllImagePaths(config.inputDir);
  totalImages = imagePaths.length;
  const workers = [];
  const workerCount = Math.min(config.concurrency, totalImages);

  log(`🚀 Starting image processing with ${chalk.bold(workerCount)} workers`, 'success');
  log(`📂 Input directory: ${chalk.cyan(config.inputDir)}`);
  log(`📁 Output directory: ${chalk.cyan(config.outputDir)}`);
  log(`📊 Total images to process: ${chalk.bold(totalImages)}`);

  // Split work among workers
  const chunkSize = Math.ceil(imagePaths.length / workerCount);
  for (let i = 0; i < workerCount; i++) {
    const chunk = imagePaths.slice(i * chunkSize, (i + 1) * chunkSize);
    const worker = new Worker(__filename, {
      workerData: { filePaths: chunk, outputDir: config.outputDir, config },
    });

    worker.on('message', (data) => {
      processedCount += chunk.length;
      Object.assign(metadata, data);

      // Log progress every 10% or 25 images
      if (processedCount % Math.floor(totalImages / 10) === 0 || processedCount % 25 === 0) {
        const progress = ((processedCount / totalImages) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`📈 Progress: ${chalk.bold(progress + '%')} (${processedCount}/${totalImages}) | Elapsed: ${elapsed}s`);
      }
    });

    worker.on('error', (error) => {
      log(`Worker error: ${error.message}`, 'error');
    });

    worker.on('exit', () => {
      workers.splice(workers.indexOf(worker), 1);
      if (workers.length === 0) {
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`\n✅ Processing complete! Total time: ${chalk.bold(totalTime + 's')}`, 'success');
        log(`💾 Saving metadata to ${path.join(config.outputDir, config.metadataFile)}...`);
        saveMetadata(metadata, config)
          .then(() => log('Metadata saved successfully!', 'success'))
          .catch((err) => log(`Error saving metadata: ${err.message}`, 'error'));
      }
    });

    workers.push(worker);
  }
}

async function processImage(filePath, outputDir, parsedPath, config) {
  const relativePath = path.relative(config.inputDir, filePath);
  log(`\n🖼️  Processing image: ${chalk.cyan(relativePath)}`, 'debug');

  const imageData = {
    original: relativePath,
    folderStructure: path.dirname(relativePath).split(path.sep),
    variants: [],
    metadata: {},
    colors: [],
  };

  try {
    // Create output directory
    await fs.ensureDir(outputDir);
    log(`📂 Created output directory: ${outputDir}`, 'debug');

    // Extract EXIF metadata
    log(`📇 Extracting EXIF data for ${relativePath}...`, 'debug');
    const exifData = await exifr.parse(filePath);
    if (exifData) {
      imageData.metadata = { /* ... (keep previous EXIF logic) ... */ };
      log(`📌 Extracted location data: ${imageData.metadata.location ? 'Found' : 'None'}`, 'debug');
    }

    // Generate blurhash
    log(`🌀 Generating blurhash for ${relativePath}...`, 'debug');
    imageData.blurhash = await generateBlurhash(filePath);
    log(`🔳 Blurhash generated: ${imageData.blurhash.substring(0, 15)}...`, 'debug');

    // Extract prominent colors using Sharp's stats
    log(`🎨 Extracting colors for ${relativePath}...`, 'debug');
    imageData.colors = await extractProminentColors(filePath, config.color);
    log(`🌈 Extracted ${imageData.colors.length} colors: ${imageData.colors.map((c) => c.type).join(', ')}`, 'debug');

    // Process image variants
    const originalImage = sharp(filePath);
    const metadata = await originalImage.metadata();

    log(`🛠️  Generating variants for ${relativePath}:`, 'debug');
    await Promise.all(
      config.sizes.map(async (size) => {
        const outputName = `${parsedPath.name}${size.suffix}.webp`;
        const outputPath = path.join(outputDir, outputName);

        await originalImage
          .clone()
          .resize({ width: size.width })
          .webp({ quality: config.qualities.webp })
          .toFile(outputPath);

        imageData.variants.push({ /* ... (keep previous variant logic) ... */ });
        log(`↔️  Created ${size.width}px WebP variant: ${outputName}`, 'debug');
      })
    );

    // Create AVIF version
    const avifOutput = `${parsedPath.name}.avif`;
    await originalImage
      .clone()
      .avif({ quality: config.qualities.avif })
      .toFile(path.join(outputDir, avifOutput));
    log(`🖼️  Created AVIF version: ${avifOutput}`, 'debug');

    // Add dimensions and size
    imageData.dimensions = { width: metadata.width, height: metadata.height };
    imageData.size = (await fs.stat(filePath)).size;
    log(`📏 Final dimensions: ${metadata.width}x${metadata.height}px | Size: ${(imageData.size / 1024).toFixed(1)}KB`, 'debug');

    return { [relativePath]: imageData };
  } catch (error) {
    log(`❌ Error processing ${relativePath}: ${error.message}`, 'error');
    return {};
  }
}

async function extractProminentColors(imagePath, colorConfig) {
  const image = sharp(imagePath);
  const { dominant } = await image.stats();
  const colors = [];

  for (let i = 0; i < colorConfig.numProminentColors; i++) {
    if (dominant[i] && dominant[i].percent >= colorConfig.dominantThreshold) {
      const hex = rgbToHex(dominant[i].r, dominant[i].g, dominant[i].b);
      const type = classifyColor(hex);
      colors.push({ hex, percentage: dominant[i].percent, type });
    }
  }

  return colors;
}

// ... (keep other functions like rgbToHex, classifyColor, etc.) ...

// Install chalk for colored logs
// Run: npm install chalk
