'use strict';

const clearMemory = require('../units/clear-memory.js');
const clearFile = require('../units/clear-file.js');
const mergeOpts = require('../utils/merge-opts.js');

const { ValidationError } = require('../utils/errors.js');

/**
 * Clears cache data from the system
 * 
 * @param {string[]|string} key The key to remove from the system. Pass an empty string to delete all cache keys
 * @param {object} opts Options including the following fields:
 * - `general.caches`: Array of caches to delete data from. Currently supports "memory" and "file"
 * - `file.root`: The root directory to use when storing data to the local file system
 */
const clearCache = async function(key, opts = {}) {
  if (key !== '' && !key) throw new ValidationError('clearCache missing parameter: key');

  // Apply default options
  opts = mergeOpts(opts, this.opts);

  const promiseArr = [];
  opts.general.caches.forEach((cacheName) => {
    if (cacheName === 'memory') promiseArr.push(clearMemory(key, this._mem));
    if (cacheName === 'file') promiseArr.push(clearFile(key, opts));
  });

  await Promise.all(promiseArr);
};

module.exports = clearCache;
