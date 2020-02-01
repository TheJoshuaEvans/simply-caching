'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const util = require('util');

const rootPath = require('../../root-path.js');
const isEqual = require('lodash.isequal');

const config = require('../../src/utils/config.js')();
const { ValidationError, CacheError } = require('../../src/utils/errors.js');
const saveToFile = require('../../src/units/save-to-file.js');

describe('save-to-file', function() {
  let originalCwd;
  before(() => {
    originalCwd = process.cwd();
  });

  it('should throw validation error with invalid parameters', async () => {
    try {
      await saveToFile();
      assert.fail('should have thrown an error');
    } catch(e) {
      assert.ok(e instanceof ValidationError);
    }

    try {
      await saveToFile('noDataProvided');
      assert.fail('should have thrown an error');
    } catch(e) {
      assert.ok(e instanceof ValidationError);
    }
  });

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
  it('should correctly save cache object', async () => {
    await saveToFile('saveToFileTestingObject', data);

    const savedData = require(path.join(testCacheDirectory, 'saveToFileTestingObject.json'));
    assert.ok(isEqual(savedData, data));
  });

  it('should not overwrite with protections enabled', async () => {
    try {
      await saveToFile('saveToFileTestingObject', {test:'data'}, {general: {overwrite:false}});
      assert.fail('should have thrown an error');
    } catch(e) {
      assert.ok(e instanceof CacheError);
    }

    const savedData = require(path.join(testCacheDirectory, 'saveToFileTestingObject.json'));
    assert.ok(isEqual(savedData, data));
  });

  it('should correctly save cache string', async () => {
    const dataString = JSON.stringify(data);
    await saveToFile('saveToFileTestingString', dataString);

    const savedData = require(path.join(testCacheDirectory, 'saveToFileTestingString.json'));
    assert.ok(isEqual(savedData, data));
  });

  const opts = {
    file: {
      root: path.join(testCacheDirectory, 'customPath')
    }
  };

  it('should be able to change the directory', async () => {
    await saveToFile('separateDirTest', data, opts);

    const savedData = require(path.join(testCacheDirectory, 'customPath', 'separateDirTest.json'));
    assert.ok(isEqual(savedData, data));
  });

  it('should be able to change directory to a relative path', async () => {
    process.chdir(rootPath);
    opts.file.root = path.join('.cache', 'customPath');
    await saveToFile('separateDirRelativeTest', data, opts);

    const savedData = require(path.join(testCacheDirectory, 'customPath', 'separateDirRelativeTest.json'));
    assert.ok(isEqual(savedData, data));
  });

  it('should be able to use subdirectories in key', async () => {
    await saveToFile('testDir/testKey', data);
    await saveToFile('testDir/testSubDir/testKey', data);

    const savedData = require(path.join(testCacheDirectory, 'testDir', 'testKey.json'));
    const savedSubData = require(path.join(testCacheDirectory, 'testDir', 'testSubDir', 'testKey.json'));
    assert.ok(isEqual(savedData, data));
    assert.ok(isEqual(savedSubData, data));
  });

  after(async () => {
    process.chdir(originalCwd);
    const unlink = util.promisify(fs.unlink).bind(fs);

    // Delete previous test cache files
    try {
      await unlink(path.join(testCacheDirectory, 'saveToFileTestingObject.json'));
    } catch(e) {
      // Allow failure - it means the file doesn't exist
    }
    try {
      await unlink(path.join(testCacheDirectory, 'saveToFileTestingString.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(testCacheDirectory, 'customPath', 'separateDirTest.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(rootPath, '.cache', 'customPath', 'separateDirRelativeTest.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(rootPath, '.cache', 'testDir', 'testKey.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(rootPath, '.cache', 'testDir', 'testSubDir', 'testKey.json'));
    } catch(e) {
      // Allow failure
    }
  });
});
