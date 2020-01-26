'use strict';

const assert = require('assert');

const { ValidationError, CacheError } = require('../../src/utils/errors.js');
const getFromMemory = require('../../src/units/get-from-memory.js');

describe('get-from-memory', function() {
  it('should throw ValidationError with bad arguments', async () => {
    assert.throws(() => getFromMemory(), ValidationError);
    assert.throws(() => getFromMemory('key'), ValidationError);
  });

  const mem = {
    testKey: 'someData'
  };
  it('should get correct objects', async () => {
    assert.equal(getFromMemory('testKey', mem), mem.testKey);
  });

  it('should throw error if the key does not exist', async () => {
    assert.throws(() => getFromMemory('notAKey', mem), CacheError);
  });
});
