// Local - Modules
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder';
import { logger } from './utils/logger.js'; // eslint-disable-line import-x/extensions

// Package
import packageJson from '../package.json' with { type: 'json' };

const
    moduleName = 'backup'
    , log = logger( moduleName )
    , version = packageJson.version
;

log.info( `Starting backup process... Version: ${ version }` );

await zip(
    '.output/public',
    `release/v${ version }.zip`,
    {
        compression: COMPRESSION_LEVEL.high,
        destPath: 'release/',
    }
);

log.success( 'Backup script executed successfully!' );
