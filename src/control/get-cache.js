'use strict';


const getFromFile = require('../units/get-from-file.js');
const getFromMemory = require('../units/get-from-memory.js');
const mergeOpts = require('../utils/merge-opts.js');

const { ValidationError, CacheError } = require('../utils/errors.js');

/**
 * Gets data from cache. The caches to get data from are defined in the `opts` parameter
 * 
 * @param {string} key The key of the data to get from the cache
 * @param {object} opts Options including the following fields:
 * - `general.caches`: Array of caches to try and get data from. Currently supports "memory" and "file"
 * - `file.root`: The root directory to use when storing data to the local file system
 * 
 * @returns {object} Data retrieved from cache
 */
const getCache = async function(key, opts = {}) {
  if (!key) throw new ValidationError('getCache missing parameter: key');

  // Apply default options
  opts = mergeOpts(opts, this.opts);

  let data;
  const { caches } = opts.general;
  for (let i=0; i<caches.length; i++) {
    const cache = caches[i];
    try {
      if (cache === 'memory') data = getFromMemory(key, this._mem);
      if (cache === 'file') data = await getFromFile(key, opts);
      break; 
    } catch (e) {
      // There was an error - allow the next method to be tried
    }
  }

  if (!data) throw new CacheError(`Could not find key "${key}" in the following caches: ${caches.join(', ')}`, key);
  return data;
};

module.exports = getCache;
