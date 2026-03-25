// Local - Modules
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder';
import { logger } from './utils/logger.js'; // eslint-disable-line import-x/extensions

// Package
import packageJson from '../package.json' with { type: 'json' };

const
    moduleName = 'release'
    , log = logger( moduleName )
    , version = packageJson.version
;

log.info( `Starting Release process... Version: ${ version }` );

await zip(
    '.output/public',
    'release/latest.zip',
    { compression: COMPRESSION_LEVEL.high }
);

log.success( 'Release script executed successfully!' );
