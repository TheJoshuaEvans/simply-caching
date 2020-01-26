'use strict';

const merge = require('lodash.merge');

const saveToMemory = require('../units/save-to-memory.js');
const saveToFile = require('../units/save-to-file.js');

/**
 * Takes a key, and saves the data according to the provided opts
 * 
 * @param {string} key Key to store the data under
 * @param {*} data Data to store. Will be converted into a string if not one already
 * @param {object} opts Options with the following fields:
 * - `caches`: Array of caches to try and save data to. Currently supports "memory" and "file"
 * - `preventOverwrite`: Setting this to true prevents memory from being overwritten
 * - `root`: The root directory to use when storing data to the local file system
 * - `mutable`: Setting this to true makes cache data mutable
 */
const setCache = async function(key, data, opts = {}) {
  opts = merge({}, this.opts, opts);

  const caches = opts.caches || opts.defaultCaches;
  const promises = caches.map((cacheName) => {
    if (cacheName === 'memory') return saveToMemory(key, data, this._mem, opts);
    if (cacheName === 'file') return saveToFile(key, data, opts);
  });
  await Promise.all(promises);
};

module.exports = setCache;
