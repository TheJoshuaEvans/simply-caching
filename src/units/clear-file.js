'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const config = require('../utils/config.js')();
const processRoot = require('../utils/process-root.js');

const { ValidationError } = require('../utils/errors.js');

const unlink = util.promisify(fs.unlink).bind(fs);

const { defaultRoot } = config.process;

/**
 * Reads a directory and returns Dirent objects with full file paths for names
 * 
 * @param {string} dir Name of the directory to read
 */
const readdir = async (dir) => {
  const originalReaddir = util.promisify(fs.readdir).bind(fs);
  return (await originalReaddir(dir, {withFileTypes: true})).map((file) => {
    file.name = path.join(dir, file.name);
    return file;
  });
}; 

/**
 * Used to clear the file cache. Provide a key to only clear a single cached object, or an empty string to clear the
 * entire file cache
 * 
 * @param {string} key The key to delete from the file cache
 * @param {object} [opts] Optional configurations for the function:
 * - `root`: File path to use for the root cache folder. If the provided value is a relative path, the path will
 *         start from the current working directly
 */
const clearFile = async (key, opts = {}) => {
  if (key !== '' && !key) throw new ValidationError('getFromFile missing parameter: key');

  const root = processRoot(opts.root, defaultRoot);
  if(key) {
    // Append .json to the key
    if (key.indexOf('.json') !== key.length - 5) {
      key = key + '.json';
    }

    const fullLocation = path.join(root, key);
    await unlink(fullLocation);
    return;
  }

  // The key is the empty string. Delete everything
  const files = await readdir(root);
  while (files.length > 0) {
    const file = files.pop();

    // If the file is a directory, get all the files in that directory and add them to the files list
    if (file.isDirectory()) {
      const newFiles = await readdir(file.name);
      newFiles.forEach((newFile) => files.push(newFile));
      continue;
    }

    // The file is not a directory, unlink it
    await unlink(file.name);
  }
};

module.exports = clearFile;
