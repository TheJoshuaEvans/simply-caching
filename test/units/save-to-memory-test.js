'use strict';

const assert = require('assert');

const saveToMemory = require('../../src/units/save-to-memory.js');
const { ValidationError, CacheError } = require('../../src/utils/errors.js');

describe('save-to-memory', function() {
  it('should throw ValidationError with incorrect arguments', async () => {
    try {
      await saveToMemory();
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof ValidationError);
    }
    try {
      await saveToMemory('key');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof ValidationError);
    }
    try {
      await saveToMemory('key', 'data');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof ValidationError);
    }
  });

  it('should set memory correctly', async () => {
    const mem = {};
    await saveToMemory('test', 'value', mem);
    assert.equal(mem.test, 'value');
  });

  it('should not overwrite memory with correct options', async () => {
    const mem = {
      test: 'value'
    };
    try {
      await saveToMemory('test', 'anotherValue', mem, { preventOverwrite: true });
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }

    assert.equal(mem.test, 'value');
  });

  it('should be immutable by default', async () => {
    const mem = {};
    const data = {
      foo: 'foo'
    };
    await saveToMemory('test', data, mem);

    data.foo = 'bar';
    assert.equal(mem.test.foo, 'foo');
  });

  it('should be able to make cache data mutable', async() => {
    const mem = {};
    const data = {
      foo: 'foo'
    };
    await saveToMemory('test', data, mem, {mutable: true});

    data.foo = 'bar';
    assert.equal(data.foo, 'bar');
  });
});
