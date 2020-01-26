'use strict';

const { ValidationError } = require('../utils/errors.js');

/**
 * Used to clear the memory cache. Provide a key to only clear a single cached object, or an empty string to clear the
 * entire memory cache
 * 
 * @param {string} key Key to clear. Explicitly pass `null` to clear all memory
 * @param {object} memObject The memory object to retrieve the data from
 */
const clearMemory = (key, memObject) => {
  const missingParams = [];
  if (key !== '' && !key) missingParams.push('clearMemory missing parameter: key');
  if (!memObject) missingParams.push('clearMemory missing parameter: memObject');
  if (missingParams.length) throw new ValidationError(missingParams);

  if(key) {
    delete memObject[key];
    return;
  }

  // The key must be ''. Delete everything
  for (const key in memObject) {
    delete memObject[key];
  }
};

module.exports = clearMemory;
