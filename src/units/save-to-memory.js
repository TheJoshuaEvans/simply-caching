'use strict';

const cloneDeep = require('lodash.clonedeep');
const mergeOpts = require('../utils/merge-opts.js');

const config = require('../utils/config.js')();
const { ValidationError, CacheError } = require('../utils/errors.js');

/**
 * Saves arbitrary data to a provided in-memory object
 * 
 * @param {string} key Data identifier
 * @param {*} data The data to cache
 * @param {object} memObject The object being used for internal memory storage
 * @param {object} [opts] Optional options object. Can contain the following fields:
 * - `general.overwrite`: Setting this to false prevents memory from being overwritten
 * - `memory.mutable`: Setting this to true makes cache data mutable
 */
const saveToMemory = (key, data, memObject, opts = {}) => {
  const issues = [];
  if (!key) issues.push('saveToMemory missing parameter: key');
  if (!data) issues.push('saveToMemory missing parameter: data');
  if (!memObject) issues.push('saveToMemory missing parameter: memObject');
  if(issues.length) throw new ValidationError(issues);

  opts = mergeOpts(opts, config);

  // Check for overwrite
  if (!opts.general.overwrite && typeof memObject[key] !== 'undefined') {
    throw new CacheError(`Error saving key "${key}" to memory`, key, data);
  }

  // Save the data
  memObject[key] = opts.memory.mutable ? data : cloneDeep(data);
};

module.exports = saveToMemory;
