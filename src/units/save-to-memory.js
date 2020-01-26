'use strict';

const cloneDeep = require('lodash.clonedeep');

const { ValidationError, CacheError } = require('../utils/errors.js');

/**
 * Saves arbitrary data to a provided in-memory object
 * 
 * @param {string} key Data identifier
 * @param {*} data The data to cache
 * @param {object} memObject The object being used for internal memory storage
 * @param {object} [opts] Optional options object. Can contain the following fields:
 * - `preventOverwrite`: Setting this to true prevents memory from being overwritten
 * - `mutable`: Setting this to true makes cache data mutable
 */
const saveToMemory = (key, data, memObject, opts = {}) => {
  const issues = [];
  if (!key) issues.push('saveToMemory missing parameter: key');
  if (!data) issues.push('saveToMemory missing parameter: data');
  if (!memObject) issues.push('saveToMemory missing parameter: memObject');
  if(issues.length) throw new ValidationError(issues);

  // Check for overwrite
  if (opts.preventOverwrite & typeof memObject[key] !== 'undefined') {
    throw new CacheError(`Error saving key "${key}" to memory`, key, data);
  }

  // Save the data
  memObject[key] = opts.mutable ? data : cloneDeep(data);
};

module.exports = saveToMemory;
