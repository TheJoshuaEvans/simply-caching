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
 * - `saveToMemory`: set to `true` to save cache to memory
 * - `saveToFile`: set to `true` to save cache to the file system
 * - `preventOverwrite`: Setting this to true prevents memory from being overwritten
 * - `root`: The root directory to use when storing data to the local file system
 * - `mutable`: Setting this to true makes cache data mutable
 */
const setCache = async function(key, data, opts = {}) {
  opts = merge({}, this.opts, opts);

  if (opts.saveToMemory) saveToMemory(key, data, this._mem, opts);
  if (opts.saveToFile) await saveToFile(key, data, opts);
};

module.exports = setCache;
