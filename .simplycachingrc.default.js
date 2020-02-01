'use strict';

const path = require('path');

const rootPath = require('./root-path.js');

/**
 * Default configuration options
 */
module.exports = {
  /**
   * General Configurations
   */
  general: {
    /**
     * The caches to use, in access order. Currently supported options are `memory` and `file`
     */
    caches: [ 'memory', 'file' ],

    /**
     * Overwrite keys with setCache
     */
    overwrite: true
  },

  /**
   * Memory cache configurations
   */
  memory: {
    /**
     * Use a static memory cache, shared between cache instances
     */
    static: false,

    /**
     * Make the memory cache mutable
     */
    mutable: false
  },

  /**
   * File cache configurations
   */
  file: {
    /**
     * The root directory to use when storing data. Default cache is contained in the module directory within `node_modules`
     */
    root: path.join(rootPath, '.cache')
  }
};
