'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const util = require('util');
const isEqual = require('lodash.isequal');

const SimplyCaching = require('../../index.js');

const config = require('../../src/utils/config.js')();
const errors = require('../../src/utils/errors.js');

const access = util.promisify(fs.access).bind(fs);
const unlink = util.promisify(fs.unlink).bind(fs);

const defaultRoot = config.file.root;
const { CacheError } = errors;

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

  it('should be able to get errors from class', async () => {
    for (const error in errors) {
      assert.equal(SimplyCaching.errors[error], errors[error]);
    }
  });

  it('should be able to store and retrieve cache with default settings', async () => {
    const cache = new SimplyCaching();

    await cache.setCache('defaultTest', data);
    const retrievedData = await cache.getCache('defaultTest');
    assert.ok(isEqual(retrievedData, data));
  });

  it('should be able to store and retrieve data from memory', async () => {
    data.random = Math.random();

    const opts = {
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

  it('should be able to get from cache if earlier cache is missing key', async () => {
    const fileOnlyCache = new SimplyCaching({caches: ['file']});
    const memoryAndFileCache = new SimplyCaching({ caching: ['memory', 'file'] });
    const fileOnlyData = { fileOnly: 'data' };
    await fileOnlyCache.setCache('fileOnlyTesting', { fileOnly: 'data' });

    const result = await memoryAndFileCache.getCache('fileOnlyTesting');

    assert.ok(isEqual(result, fileOnlyData));
  });

  it('should correctly handle general.caches config', async () => {
    const memoryCache = new SimplyCaching({general: {caches: ['memory']}});
    const fileCache = new SimplyCaching({general: {caches: ['file']}});
    const memoryFileCache = new SimplyCaching({general: {caches: ['memory', 'file']}});

    const data = {some: 'data'};
    await memoryCache.setCache('memoryCacheTest', data);
    assert.ok(isEqual(memoryCache._mem.memoryCacheTest, data));
    try {
      await access(path.join(defaultRoot, 'memoryCacheTest.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }

    await fileCache.setCache('fileCacheTest', data);
    assert.ok(typeof fileCache._mem.fileCacheTest === 'undefined');
    await access(path.join(defaultRoot, 'fileCacheTest.json'));

    await memoryFileCache.setCache('memoryFileCacheTest', data);
    assert.ok(isEqual(memoryFileCache._mem.memoryFileCacheTest, data));
    await access(path.join(defaultRoot, 'memoryFileCacheTest.json'));
  });

  it('should correctly handle depreciated caches config', async () => { // TODO: Delete with V2.0
    // Test for depreciated config
    try { await unlink(path.join(defaultRoot, 'fileCacheTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'memoryFileCacheTest.json')); } catch(e) { /**/ }
    const memoryCache = new SimplyCaching({caches: ['memory']});
    const fileCache = new SimplyCaching({caches: ['file']});
    const memoryFileCache = new SimplyCaching({caches: ['memory', 'file']});

    const data = {some: 'data'};
    await memoryCache.setCache('memoryCacheTest', data);
    assert.ok(isEqual(memoryCache._mem.memoryCacheTest, data));
    try {
      await access(path.join(defaultRoot, 'memoryCacheTest.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }

    await fileCache.setCache('fileCacheTest', data);
    assert.ok(typeof fileCache._mem.fileCacheTest === 'undefined');
    await access(path.join(defaultRoot, 'fileCacheTest.json'));

    await memoryFileCache.setCache('memoryFileCacheTest', data);
    assert.ok(isEqual(memoryFileCache._mem.memoryFileCacheTest, data));
    await access(path.join(defaultRoot, 'memoryFileCacheTest.json'));
  });

  it('should correctly handle general.overwrite config', async () => {
    const preventOverwriteCache = new SimplyCaching({general: {overwrite: false}});
    const overwriteCache = new SimplyCaching({general: {overwrite: true}});

    const data = { some: 'data' };
    await preventOverwriteCache.setCache('preventOverwriteTrueTest', data);
    try {
      await preventOverwriteCache.setCache('preventOverwriteTrueTest', data);
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }

    await overwriteCache.setCache('preventOverwriteFalseTest', data);
    await overwriteCache.setCache('preventOverwriteFalseTest', { someOther: 'data' });
    assert.ok(!isEqual(data, await overwriteCache.getCache('preventOverwriteFalseTest')));
  });

  it('should correctly handle depreciated preventOverwrite config', async () => { // TODO: Delete with V2.0
    try { await unlink(path.join(defaultRoot, 'preventOverwriteFalseTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'preventOverwriteTrueTest.json')); } catch(e) { /**/ }
    const preventOverwriteCache = new SimplyCaching({preventOverwrite: true});
    const overwriteCache = new SimplyCaching({preventOverwrite: false});

    const data = { some: 'data' };
    await preventOverwriteCache.setCache('preventOverwriteTrueTest', data);
    try {
      await preventOverwriteCache.setCache('preventOverwriteTrueTest', data);
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }

    await overwriteCache.setCache('preventOverwriteFalseTest', data);
    await overwriteCache.setCache('preventOverwriteFalseTest', { someOther: 'data' });
    assert.ok(!isEqual(data, await overwriteCache.getCache('preventOverwriteFalseTest')));
  });
  
  it('should correctly handle memory.static config', async () => {
    const staticCache1 = new SimplyCaching({memory: {static: true}, general: {caches: ['memory']}});
    const staticCache2 = new SimplyCaching({memory: {static: true}, general: {caches: ['memory']}});
    const nonStaticCache1 = new SimplyCaching({memory: {static: false}, general: {caches: ['memory']}});
    const nonStaticCache2 = new SimplyCaching({memory: {static: false}, general: {caches: ['memory']}});

    const data = { some: 'data' };
    await staticCache1.setCache('staticCacheTest', data);
    const staticCachedData = await staticCache2.getCache('staticCacheTest');
    assert.ok(isEqual(staticCachedData, data));

    await nonStaticCache1.setCache('nonStaticCacheTest', data);
    try {
      await nonStaticCache2.getCache('nonStaticCacheTest');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
  });

  it('should correctly handle depreciated useStaticMemory config', async () => { // TODO: Delete with V2.0
    const staticCache1 = new SimplyCaching({useStaticMemory: true, general: {caches: ['memory']}});
    const staticCache2 = new SimplyCaching({useStaticMemory: true, general: {caches: ['memory']}});
    const nonStaticCache1 = new SimplyCaching({useStaticMemory: false, general: {caches: ['memory']}});
    const nonStaticCache2 = new SimplyCaching({useStaticMemory: false, general: {caches: ['memory']}});

    const data = { some: 'data' };
    await staticCache1.setCache('staticCacheTest', data);
    const staticCachedData = await staticCache2.getCache('staticCacheTest');
    assert.ok(isEqual(staticCachedData, data));

    await nonStaticCache1.setCache('nonStaticCacheTest', data);
    try {
      await nonStaticCache2.getCache('nonStaticCacheTest');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
  });

  it('should correctly handle memory.mutable config', async () => {
    const mutableCache = new SimplyCaching({memory: {mutable: true}, general: {caches: ['memory']}});
    const immutableCache = new SimplyCaching({memory: {mutable: false}, general: {caches: ['memory']}});

    const mutableData = { isMutable: false };
    await mutableCache.setCache('mutableTest', mutableData);
    mutableData.isMutable = true;
    const cachedMutable = await mutableCache.getCache('mutableTest');
    assert.equal(cachedMutable.isMutable, true);

    const immutableData = { isMutable: false };
    await immutableCache.setCache('immutableTest', immutableData);
    immutableData.isMutable = true;
    const cachedImmutable = await immutableCache.getCache('immutableTest');
    assert.equal(cachedImmutable.isMutable, false);
  });

  it('should correctly handle depreciated mutable config', async () => { // TODO: Delete with V2.0
    const mutableCache = new SimplyCaching({memory: {mutable: true}, general: {caches: ['memory']}});
    const immutableCache = new SimplyCaching({memory: {mutable: false}, general: {caches: ['memory']}});

    const mutableData = { isMutable: false };
    await mutableCache.setCache('mutableTest', mutableData);
    mutableData.isMutable = true;
    const cachedMutable = await mutableCache.getCache('mutableTest');
    assert.equal(cachedMutable.isMutable, true);

    const immutableData = { isMutable: false };
    await immutableCache.setCache('immutableTest', immutableData);
    immutableData.isMutable = true;
    const cachedImmutable = await immutableCache.getCache('immutableTest');
    assert.equal(cachedImmutable.isMutable, false);
  });

  it('should correctly handle file.root config', async () => {
    const customRootCache = new SimplyCaching({file: {root: path.join(defaultRoot, 'testDir')}, general: {caches: ['file']}});

    const data = { some: 'data' };
    await customRootCache.setCache('customRootTest', data);
    assert.ok(isEqual(require(path.join(defaultRoot, 'testDir', 'customRootTest.json')), data));
  });

  it('should correctly handle depreciated root config', async () => { // TODO: Delete with V2.0
    try { await unlink(path.join(defaultRoot, 'testDir', 'customRootTest.json')); } catch(e) { /**/ }
    const customRootCache = new SimplyCaching({root: path.join(defaultRoot, 'testDir'), general: {caches: ['file']}});

    const data = { some: 'data' };
    await customRootCache.setCache('customRootTest', data);
    assert.ok(isEqual(require(path.join(defaultRoot, 'testDir', 'customRootTest.json')), data));
  });

  after(async () => {
    try { await unlink(path.join(defaultRoot, 'clearMultipleTesting1.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'clearMultipleTesting2.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'clearMultipleTesting3.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'clearSingleTesting.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'fileTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'memoryAndFileTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'preventOverwriteFalseTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'preventOverwriteTrueTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'fileCacheTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'memoryFileCacheTest.json')); } catch(e) { /**/ }
    try { await unlink(path.join(defaultRoot, 'testDir', 'customRootTest.json')); } catch(e) { /**/ }
  });
});
