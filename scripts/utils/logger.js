// Third party - External - Log
import { createConsola } from 'consola';

// Exports
export const logger = ( moduleName = '' ) => createConsola( { defaults: { tag: `unibo:${ moduleName || 'default' }` } } );
