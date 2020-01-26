'use strict';

const path = require('path');

const rootPath = require('./root-path.js');

/**
 * Default configuration file. Any values also present in the .simplycaching.js file will be overridden. All values
 * marked as `undefined` _must_ be defined in the .simplycaching.js file
 */
module.exports = {
  /**
   * General settings for the simply caching process
   */
  process: {
    /**
     * Directory where the cache can be found
     */
    defaultRoot: path.join(rootPath, '.cache'),

    /**
     * Default cache order when getting cached data
     */
    defaultCaches: [ 'memory', 'file' ]
  }
};
