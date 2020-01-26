'use strict';

const merge = require('lodash.merge');

const simplyCachingConfig = require('../../.simplycachingrc.default.js');

/**
 * Singleton used to prevent loading configs every time this method is referenced
 * 
 * @type {simplyCachingConfig}
 */
let singletonConfig;

/**
 * Simple helper function recursively travels a provided object and returns "false" if any values are undefined. A log
 * will also be automatically made to stderr detailing the nature of the failure
 * 
 * @param {object} obj The object to check
 * @param {string} originalKey The key related to the object being checked
 */
const checkForUndefinedRecursive = (obj, originalKey = 'this') => {
  if (typeof obj === 'undefined') {
    console.error(`Item with key ${originalKey} is undefined`);
    return false;
  }

  // Don't check strings
  if (typeof obj === 'string') return true;

  // For-in statements don't run on non-indexed data types
  for (const key in obj) {
    const item = obj[key];

    if (!checkForUndefinedRecursive(item, key)) {
      return false;
    }
  }

  return true;
};

/**
 * Method handles initialization of configurations
 * 
 * Configurations are gathered from the following sources, with later sources overriding previous sources
 * 1. The ..simplycaching.default.js file
 * 2. The ignored ..simplycaching.js file
 * 3. An object passed to the class constructor
 */
module.exports = (configObject) => {
  // Only create a new config object if it doesn't exist, and we are not in debug mode
  if (singletonConfig) return singletonConfig;

  let secretConfig = {};
  try {
    secretConfig = require('../../..simplycaching.js');
  } catch (e) {
    // No secret config
  }

  merge(simplyCachingConfig, secretConfig, configObject);

  if (!checkForUndefinedRecursive(this)) {
    throw new Error('Undefined configurations detected');
  }

  singletonConfig = simplyCachingConfig;

  return simplyCachingConfig;
};
