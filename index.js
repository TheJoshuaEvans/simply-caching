'use strict';

const config = require('./src/utils/config.js')();
const errors = require('./src/utils/errors.js');
const mergeOpts = require('./src/utils/merge-opts.js');

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
   * @param {object} opts See `.simplycachingrc.default.js` for possible values
   */
  constructor(opts = {}) {
    /**
     * Options that were provided to the instance on construction. Defaults are defined in the .simplycachingrc.js files
     */
    this.opts = mergeOpts(opts, config);

    (() => { // TODO: DELETE WITH V2
      if (this.opts.useStaticMemory) {
        console.warn('DEPRECATION WARNING: Configuration value `useStaticMemory` will be removed in version 2.0. Use `memory.static` instead');
        this.opts.memory.static = this.opts.useStaticMemory;
        delete this.opts.useStaticMemory;
      }
      if (this.opts.preventOverwrite) {
        console.warn('DEPRECATION WARNING: Configuration value `preventOverwrite` will be removed in version 2.0. Use `general.overwrite` instead');
        this.opts.general.overwrite = !this.opts.preventOverwrite;
        delete this.opts.preventOverwrite;
      }
      if (this.opts.root) {
        console.warn('DEPRECATION WARNING: Configuration value `root` will be removed in version 2.0. Use `file.root` instead');
        this.opts.file.root = this.opts.root;
        delete this.opts.root;
      }
      if (this.opts.caches) {
        console.warn('DEPRECATION WARNING: Configuration value `caches` will be removed in version 2.0. Use `general.caches` instead');
        this.opts.general.caches = this.opts.caches;
        delete this.opts.caches;
      }
      if (this.opts.mutable) {
        console.warn('DEPRECATION WARNING: Configuration value `mutable` will be removed in version 2.0. Use `memory.mutable` instead');
        this.opts.memory.mutable = this.opts.mutable;
        delete this.opts.mutable;
      }
    })();
  
    if (this.opts.memory.static) this._mem = mem;

    // Methods
    this.setCache = setCache.bind(this);
    this.getCache = getCache.bind(this);
    this.clearCache = clearCache.bind(this);
  }

  /**
   * @private
   * The internal cache object used when saving data in-memory
   */
  _mem = {};
}

SimplyCaching.errors = errors;

module.exports = SimplyCaching;
