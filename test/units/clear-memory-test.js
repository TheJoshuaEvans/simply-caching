'use strict';

const assert = require('assert');

const clearMemory = require('../../src/units/clear-memory.js');
const { ValidationError } = require('../../src/utils/errors.js');

describe('clear-memory', function() {
  it('should throw ValidationError with incorrect parameters', async () => {
    assert.throws(() => clearMemory(), ValidationError);
    assert.throws(() => clearMemory('invalidParams'), ValidationError);
  });

  it('should clear single keys', () => {
    const mem = {
      singleKey: 1,
      multiKey1: 1,
      multiKey2: 2,
      multiKey3: 3
    };
    clearMemory('singleKey', mem);
    assert.ok(mem.multiKey1);
    assert.ok(mem.multiKey2);
    assert.ok(mem.multiKey3);
  });

  it('should clear multiple keys', () => {
    const mem = {
      multiKey1: 1,
      multiKey2: 2,
      multiKey3: 3
    };
    clearMemory('', mem);
    assert.equal(typeof mem.multiKey1, 'undefined');
    assert.equal(typeof mem.multiKey2, 'undefined');
    assert.equal(typeof mem.multiKey3, 'undefined');
  });

  it('should not clear keys with falsy, non-string key', async () => {
    const mem = {
      multiKey1: 1,
      multiKey2: 2,
      multiKey3: 3
    };
    try {
      clearMemory(null, mem);
    } catch(e) {
      // Allow failure
    }
    assert.ok(mem.multiKey1);
    assert.ok(mem.multiKey2);
    assert.ok(mem.multiKey3);
  });
});
