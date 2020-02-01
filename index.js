'use strict';

const merge = require('lodash.merge');

const errors = require('./src/utils/errors.js');

// Control functions
const setCache = require('./src/control/set-cache.js');
const getCache = require('./src/control/get-cache.js');
const clearCache = require('./src/control/clear-cache.js');

/**
 * Singleton memory
 */
const mem = {};

/**
 * Simple caching class
 */
class SimplyCaching {
  /**
   * Provide the constructor with default options that should be passed to all operations
   * 
   * @param {object} opts Options with the following fields:
   * - `useStaticMemory`: Setting this to true uses the static memory cache
   * - `preventOverwrite`: Setting this to true prevents memory from being overwritten
   * - `root`: The root directory to use when storing data to the local file system
   * - `caches`: Array of caches to try and get data from. Currently supports "memory" and "file"
   * - `mutable`: Setting this to true makes cache data mutable
   */
  constructor(opts = {}) {
    this.opts = merge({}, this.opts, opts);

    if (opts.useStaticMemory) this._mem = mem;

    // Methods
    this.setCache = setCache.bind(this);
    this.getCache = getCache.bind(this);
    this.clearCache = clearCache.bind(this);
  }

  /**
   * Options that were provided to the instance on construction. Defaults are defined in the .simplycachingrc.js files
   */
  opts = require('./src/utils/config.js')().process;

  /**
   * @private
   * The internal cache object used when saving data in-memory
   */
  _mem = {};
}

SimplyCaching.errors = errors;

module.exports = SimplyCaching;
