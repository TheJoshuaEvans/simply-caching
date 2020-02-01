'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const util = require('util');

const isEqual = require('lodash.isequal');

const getFromFile = require('../../src/units/get-from-file.js');
const config = require('../../src/utils/config.js')();
const { ValidationError, CacheError } = require('../../src/utils/errors.js');

const mkdir = util.promisify(fs.mkdir).bind(fs);
const writeFile = util.promisify(fs.writeFile).bind(fs);
const unlink = util.promisify(fs.unlink).bind(fs);

describe('get-from-file', function() {
  const testCacheDirectory = config.file.root;
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
    ]
  };
  const customPathData = { test: 'data' };
  before(async () => {
    await mkdir(path.join(testCacheDirectory, 'customPath'), {recursive: true});
    await writeFile(path.join(testCacheDirectory, 'getCacheTest.json'), JSON.stringify(data));
    await writeFile(path.join(testCacheDirectory, 'customPath', 'getCacheTest.json'), JSON.stringify(customPathData));
    await writeFile(path.join(testCacheDirectory, 'testDir', 'testSubDir', 'testKey.json'), JSON.stringify(data));
  });

  it('should throw validation error with invalid parameters', async () => {
    try {
      await getFromFile();
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof ValidationError);
    }
  });

  it('should throw cache error when getting invalid cache location', async () => {
    try {
      await getFromFile('notACacheLocation');
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof CacheError);
    }
  });

  it('should get cache object correctly without .json', async () => {
    const cachedData = await getFromFile('getCacheTest');
    assert.ok(isEqual(cachedData, data));
  });

  it('should get cache object correctly with .json', async () => {
    const cachedData = await getFromFile('getCacheTest.json');
    assert.ok(isEqual(cachedData, data));
  });

  it('should be able to set root correctly', async () => {
    const opts = {
      file: {
        root: path.join(testCacheDirectory, 'customPath')
      }
    };
    const cachedData = await getFromFile('getCacheTest.json', opts);
    assert.ok(isEqual(cachedData, customPathData));
  });

  it('should be able to get subdirectory object', async () => {
    const cachedData = await getFromFile('testDir/testSubDir/testKey');
    assert.ok(isEqual(cachedData, data));
  });

  after(async() => {
    await unlink(path.join(testCacheDirectory, 'getCacheTest.json'));
    await unlink(path.join(testCacheDirectory, 'customPath', 'getCacheTest.json'));
    await unlink(path.join(testCacheDirectory, 'testDir', 'testSubDir', 'testKey.json'));
  });
});
