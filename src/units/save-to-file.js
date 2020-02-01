'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const mergeOpts = require('../utils/merge-opts.js');

const config = require('../utils/config.js')();
const processRoot = require('../utils/process-root.js');

const { ValidationError, CacheError } = require('../utils/errors.js');

const mkdir = util.promisify(fs.mkdir).bind(fs);
const writeFile = util.promisify(fs.writeFile).bind(fs);
const access = util.promisify(fs.access).bind(fs);

/**
 * Saves data to a file. If the provided data is not a string, it will be converted into a string via JSON.stringify
 * 
 * @param {string} key Key to save the data under
 * @param {object} data The data to store. Can also be a string
 * @param {object} [opts] Optional configurations for the function:
 * - `file.root`: File path to use for the root cache folder. If the provided value is a relative path, the path will
 *          start from the current working directly
 * - `general.overwrite`: Setting this to false prevents memory from being overwritten
 */
const saveToFile = async (key, data, opts = {}) => {
  const missingParams = [];
  if (!key) missingParams.push('saveCache missing parameter: key');
  if (!data) missingParams.push('saveCache missing parameter: data');
  if (missingParams.length) throw new ValidationError(missingParams);

  opts = mergeOpts(opts, config);

  // Convert data to string
  if (typeof data !== 'string') data = JSON.stringify(data);

  // Append .json to the key
  if (key.indexOf('.json') !== key.length - 5) {
    key = key + '.json';
  }

  const fullLocation = path.join(processRoot(opts.file.root, config.file.root), key);

  // Check for overwrite protection
  if (!opts.general.overwrite) {
    let cacheExists = false;
    try {
      await access(fullLocation);
      cacheExists = true;
    } catch(e) {
      // The file does not exist, allow the process to continue;
    }
    if (cacheExists) throw new CacheError(`Attempting to overwrite key "${key} with protections enabled`, key, data);
  }

  await mkdir(path.dirname(fullLocation), {recursive: true});
  try {
    await writeFile(fullLocation, data);

    // Also clear the require cache
    delete require.cache[fullLocation];
  } catch(e) {
    throw new CacheError(`Error saving "${key} to file`, key, data);
  }
};

module.exports = saveToFile;
