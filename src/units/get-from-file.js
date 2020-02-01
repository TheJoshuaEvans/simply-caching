'use strict';

const path = require('path');

const mergeOpts = require('../utils/merge-opts.js');

const config = require('../utils/config.js')();
const { ValidationError, CacheError } = require('../utils/errors.js');
const processRoot = require('../utils/process-root.js');

/**
 * Retrieves information cached to the file system
 * 
 * @param {string} key The key to retrieve
 * @param {object} [opts] Optional configurations for the function:
 * - `file.root`: File path to use for the root cache folder. If the provided value is a relative path, the path will
 *         start from the current working directly
 */
const getFromFile = async (key, opts = {}) => {
  if (!key) throw new ValidationError('getFromFile missing parameter: key');

  opts = mergeOpts(opts, config);

  // Append .json to the key
  if (key.indexOf('.json') !== key.length - 5) {
    key = key + '.json';
  }

  const fullLocation = path.join(processRoot(opts.file.root, config.file.root), key);
  let cachedData;
  try {
    cachedData = require(fullLocation);
  } catch(e) {
    throw new CacheError(`Could not find cached file with key "${key}"`, key);
  }

  return cachedData;
};

module.exports = getFromFile;
