'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const util = require('util');

const clearFile = require('../../src/units/clear-file.js');
const config = require('../../src/utils/config.js')();
const { ValidationError } = require('../../src/utils/errors.js');

const mkdir = util.promisify(fs.mkdir).bind(fs);
const writeFile = util.promisify(fs.writeFile).bind(fs);
const unlink = util.promisify(fs.unlink).bind(fs);
const access = util.promisify(fs.access).bind(fs);

const { defaultRoot } = config.process;

describe('clear-file', function() {
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

  before(async () => {
    await mkdir(defaultRoot, {recursive: true});
    await writeFile(path.join(defaultRoot, 'singleTest.json'), JSON.stringify(data));
    await writeFile(path.join(defaultRoot, 'multiTest1.json'), JSON.stringify(data));
    await writeFile(path.join(defaultRoot, 'multiTest2.json'), JSON.stringify(data));
    await writeFile(path.join(defaultRoot, 'multiTest3.json'), JSON.stringify(data));
  });

  it('should throw validation error with invalid parameters', async () => {
    try {
      await clearFile();
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.ok(e instanceof ValidationError);
    }
  });

  it('should not clear keys with falsy, non-string key', async () => {
    try {
      await clearFile(null);
    } catch(e) {
      // Allow failure
    }

    await access(path.join(defaultRoot, 'singleTest.json'));
    await access(path.join(defaultRoot, 'multiTest1.json'));
    await access(path.join(defaultRoot, 'multiTest2.json'));
    await access(path.join(defaultRoot, 'multiTest3.json'));
  });

  it('should clear single keys', async () => {
    await clearFile('singleTest');

    try {
      await access(path.join(defaultRoot, 'singleTest.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }

    await access(path.join(defaultRoot, 'multiTest1.json'));
    await access(path.join(defaultRoot, 'multiTest2.json'));
    await access(path.join(defaultRoot, 'multiTest3.json'));
  });

  it('should clear multiple keys', async () => {
    await clearFile('');

    try {
      await access(path.join(defaultRoot, 'multiTest1.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
    try {
      await access(path.join(defaultRoot, 'multiTest2.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
    try {
      await access(path.join(defaultRoot, 'multiTest3.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
  });

  it('should clear with custom root', async () => {
    await mkdir(path.join(defaultRoot, 'customPath'), { recursive: true });
    await writeFile(path.join(defaultRoot, 'customPath', 'multiTest4.json'), JSON.stringify(data));
    await writeFile(path.join(defaultRoot, 'customPath', 'multiTest5.json'), JSON.stringify(data));
    await writeFile(path.join(defaultRoot, 'customPath', 'multiTest6.json'), JSON.stringify(data));

    const opts = {
      root: path.join(defaultRoot, 'customPath')
    };
    await clearFile('', opts);
    
    try {
      await access(path.join(defaultRoot, 'customPath', 'multiTest4.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
    try {
      await access(path.join(defaultRoot, 'customPath', 'multiTest5.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
    try {
      await access(path.join(defaultRoot, 'customPath', 'multiTest6.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
  });

  it('should not throw an error when clearing non-existent cache', async () => {
    await clearFile('notAPath');
  });

  it('should clear files with subdirectories', async () => {
    await mkdir(path.join(defaultRoot, 'testDir', 'testSubDir'), { recursive: true });
    await writeFile(path.join(defaultRoot, 'testDir', 'testSubDir', 'testKey.json'), JSON.stringify(data));

    await clearFile('testDir/testSubDir/testKey');

    try {
      await access(path.join(defaultRoot, 'testDir', 'testSubDir', 'testKey.json'));
      assert.fail('should have thrown an error');
    } catch (e) {
      assert.equal(e.code, 'ENOENT');
    }
  });

  after(async () => {
    try {
      await unlink(path.join(defaultRoot, 'singleTest.json'));
    } catch(e) {
      // Allow failure - it means the file doesn't exist
    }
    try {
      await unlink(path.join(defaultRoot, 'multiTest1.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'multiTest2.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'multiTest3.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'customPath', 'multiTest4.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'customPath', 'multiTest5.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'customPath', 'multiTest6.json'));
    } catch(e) {
      // Allow failure
    }
    try {
      await unlink(path.join(defaultRoot, 'testDir', 'testSubDir', 'testKey.json'));
    } catch(e) {
      // Allow failure
    }
  });
});
