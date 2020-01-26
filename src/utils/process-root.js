'use strict';

const path = require('path');

/**
 * Takes a custom "root" path and returns a processed absolute path. The following conditions are followed
 * - If root is falsy: The provided default is used
 * - If root is an absolute path: The provided root is returned
 * - if root is a relative path: The provided root is made to be relative to the current working directory
 * 
 * @param {string} root Root file path to be processed
 * @param {string} defaultRoot Default file path to use if root is falsy
 */ 
const processRoot = (root, defaultRoot) => {
  if (!root) {
    return defaultRoot;
  } else if (path.isAbsolute(root)) {
    return root;
  }
  
  return path.join(process.cwd(), root);
};

module.exports = processRoot;
