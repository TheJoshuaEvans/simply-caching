'use strict';

const assert = require('assert');

const Config = require('../../src/utils/config.js');

describe('config', () => {
  it('should be able to instantiate config', () => {
    assert.doesNotThrow(() => Config());
  });

  it('should not create a 2nd new config object', () => {
    const newConfig = Config({ cacheRoot: 1 });

    assert.notEqual(newConfig.process.cacheRoot, 1);
  });

  after(() => {
    Config();
    process.argv = process.argv.filter((arg) => arg !== '--debug');
  });
});
