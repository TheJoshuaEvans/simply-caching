'use strict';

const cloneDeep = require('lodash.clonedeep');

/**
 * Takes multiple configuration objects and merges them together. Objects earlier in the argument list will
 * overwrite objects later in the list
 * 
 * @param  {...args} args Configuration options
 * 
 * @returns {object} Single combined object
 */
const mergeOpts = function(...args) {
  if (args.length === 1) return cloneDeep(args[0]);

  const combined = {};
  args.forEach((opts) => {
    for (const key in opts) {
      const values = opts[key];
      if (!combined[key]) {
        combined[key] = cloneDeep(values);
        continue;
      }

      combined[key] = Object.assign({}, values, combined[key]);
    }
  });

  return combined;
};

module.exports = mergeOpts;
