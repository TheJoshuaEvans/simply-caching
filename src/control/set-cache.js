'use strict';

const saveToMemory = require('../units/save-to-memory.js');
const saveToFile = require('../units/save-to-file.js');
const mergeOpts = require('../utils/merge-opts.js');

/**
 * Takes a key, and saves the data according to the provided opts
 * 
 * @param {string} key Key to store the data under
 * @param {*} data Data to store. Will be converted into a string if not one already
 * @param {object} opts Options with the following fields:
 * - `general.caches`: Array of caches to try and save data to. Currently supports "memory" and "file"
 * - `general.overwrite`: Setting this to false prevents memory from being overwritten
 * - `file.root`: The root directory to use when storing data to the local file system
 * - `memory.mutable`: Setting this to true makes cache data mutable
 */
const setCache = async function(key, data, opts = {}) {
  opts = mergeOpts(opts, this.opts);

  const caches = opts.general.caches;
  const promises = caches.map((cacheName) => {
    if (cacheName === 'memory') return saveToMemory(key, data, this._mem, opts);
    if (cacheName === 'file') return saveToFile(key, data, opts);
  });
  await Promise.all(promises);
};

module.exports = setCache;
