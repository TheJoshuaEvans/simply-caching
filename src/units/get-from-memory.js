'use strict';

const { ValidationError, CacheError } = require('../utils/errors.js');

/**
 * Retrieves data from a provided memObject
 * 
 * @param {string} key The key to retrieve
 * @param {object} memObject The memory object to retrieve the data from
 */
const getFromMemory = (key, memObject) => {
  const missingParams = [];
  if (!key) missingParams.push('getFromMemory missing parameter: key');
  if (!memObject) missingParams.push('getFromMemory missing parameter: memObject');
  if (missingParams.length) throw new ValidationError(missingParams);

  if (!memObject[key]) throw new CacheError(`Key "${key}" not present on memory object`, key, null);

  return memObject[key];
};

module.exports = getFromMemory;
