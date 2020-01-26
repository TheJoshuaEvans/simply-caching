'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const util = require('util');
const isEqual = require('lodash.isequal');

const SimplyCaching = require('../../index.js');

const config = require('../../src/utils/config.js')();
const { CacheError } = require('../../src/utils/errors.js');

const unlink = util.promisify(fs.unlink).bind(fs);

const { defaultRoot } = config.process;

describe('SimplyCaching', function() {
  const data = {
    string: 'string',
    number: 123,
    object: {
      some: 'object'
    },
    array: [
      'an',
      'array',
      1234
    ],
    random: Math.random()
  };
  it('should be able to store and retrieve cache with default settings', async () => {
    const cache = new SimplyCaching();

    await cache.setCache('defaultTest', data);
    const retrievedData = await cache.getCache('defaultTest');
    assert.ok(isEqual(retrievedData, data));
  });

  it('should be able to store and retrieve data from memory', async () => {
    data.random = Math.random();

    const opts = {
      saveToMemory: true,
      caches: [ 'memory' ]
    };
    const cache = new SimplyCaching(opts);
    await cache.setCache('fileTest', data);

    const retrievedData = await cache.getCache('fileTest');
    assert.ok(isEqual(retrievedData, data));
  });

  it('should be able to store and retrieve data from the file system', async () => {
    data.random = Math.random();

    const opts = {
      saveToMemory: false,
      saveToFile: true,
      caches: [ 'file' ]
    };
    const cache = new SimplyCaching(opts);
    await cache.setCache('fileTest', data);
    assert.equal(typeof cache._mem.fileTest, 'undefined');

    const retrievedData = await cache.getCache('fileTest');
    assert.ok(isEqual(retrievedData, data));
  });

  it('should be able to get data from memory when it is also saved in the file system', async () => {
    data.random = Math.random();

    const opts = {
      saveToFile: true,
      saveToMemory: true,
      mutable: true,
      caches: [ 'memory' ]
    };

    const cache = new SimplyCaching(opts);
    await cache.setCache('memoryAndFileTest', data);

    data.random = Math.random();

    const retrievedData = await cache.getCache('memoryAndFileTest');
    assert.equal(retrievedData.random, data.random);
  });

  it('should use nonstatic memory by default', async () => {
    const opts = {
      saveToMemory: true,
      caches: [ 'memory' ]
    };
    const cache1 = new SimplyCaching(opts);
    const cache2 = new SimplyCaching(opts);

    await cache1.setCache('nonstaticTest', data);
    try {
      await cache2.getCache('nonstaticTest');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
  });

  it('should be able to use static memory', async () => {
    const opts = {
      useStaticMemory: true,
      saveToMemory: true,
      caches: [ 'memory' ]
    };
    const cache1 = new SimplyCaching(opts);
    const cache2 = new SimplyCaching(opts);

    await cache1.setCache('staticTest', data);
    const retrievedData = await cache2.getCache('staticTest');
    assert.ok(isEqual(retrievedData, data));
  });

  it('should be able to clear cache in default mode', async () => {
    const opts = {
      saveToFile: true,
      saveToMemory: true,
      caches: [ 'memory', 'file' ]
    };
    const cache = new SimplyCaching(opts);

    await cache.setCache('clearSingleTesting', data);
    await cache.setCache('clearMultipleTesting1', data);
    await cache.setCache('clearMultipleTesting2', data);
    await cache.setCache('clearMultipleTesting3', data);

    // Delete one key without effecting others
    await cache.clearCache('clearSingleTesting');
    try {
      await cache.getCache('clearSingleTesting');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
    await cache.getCache('clearMultipleTesting1');
    await cache.getCache('clearMultipleTesting2');
    await cache.getCache('clearMultipleTesting3');

    // Delete all keys
    await cache.clearCache('');
    try {
      await cache.getCache('clearMultipleTesting1');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
    try {
      await cache.getCache('clearMultipleTesting2');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
    try {
      await cache.getCache('clearMultipleTesting4');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
  });

  after(async () => {
    try {
      await unlink(path.join(defaultRoot, 'clearMultipleTesting1.json'));
    } catch(e) {
      // Allow failure - it means the file doesn't exist
    }
    try {
      await unlink(path.join(defaultRoot, 'clearMultipleTesting2.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'clearMultipleTesting3.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'clearSingleTesting.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'fileTest.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'memoryAndFileTest.json'));
    } catch(e) {
      // Allow failure
    }
  });
});
