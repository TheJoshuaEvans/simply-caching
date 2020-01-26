'use strict';

const assert = require('assert');
const path = require('path');

const rootPath = require('../../root-path.js');
const processRoot = require('../../src/utils/process-root.js');

describe('process-root', function() {
  let originalCwd;
  before(() => {
    originalCwd = process.cwd();
  });

  it('should process roots correctly', async () => {
    process.chdir(rootPath);

    const defaultRoot = '/some/default/path';
    const falsyRoot = null;
    assert.equal(processRoot(falsyRoot, defaultRoot), defaultRoot);
    
    const absoluteRoot = '/some/absolute/root';
    assert.equal(processRoot(absoluteRoot, defaultRoot), absoluteRoot);

    const relativeRoot = 'some/relative/root';
    assert.equal(processRoot(relativeRoot, defaultRoot), path.join(rootPath, relativeRoot));
  });

  after(async () => {
    process.chdir(originalCwd);
  });
});
