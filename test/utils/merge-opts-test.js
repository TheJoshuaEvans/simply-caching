'use strict';

const assert = require('assert');

const cloneDeep = require('lodash.clonedeep');
const isEqual = require('lodash.isequal');

const mergeOpts = require('../../src/utils/merge-opts.js');

describe('merge-opts', function() {
  it('should merge option objects together correctly', async () => {
    const opts1 = {
      general: {
        caches: [ 'memory' ],
        overwrite: false
      },
      memory: {
        static: true
      }
    };
    const opts2 = {
      general: {
        caches: [ 'file' ]
      },
      memory: {
        mutable: true,
        static: false
      },
      file: {
        root: 'some/root'
      }
    };
    const actual = mergeOpts(opts1, opts2);
    const expected = {
      general: {
        caches: [ 'memory' ],
        overwrite: false
      },
      memory: {
        static: true,
        mutable: true
      },
      file: {
        root: 'some/root'
      }
    };
    assert.ok(isEqual(actual, expected));
  });

  it('should not alter the objects provided in arguments', async () => {
    const original1 = {
      mutable: false
    };
    const original1Clone = cloneDeep(original1);
    const original2 = {
      mutable: true,
      newKey: true
    };
    const original2Clone = cloneDeep(original2);
    mergeOpts(original1, original2);
    assert.ok(isEqual(original1, original1Clone));
    assert.ok(isEqual(original2, original2Clone));
  });

  it('should clone with one argument', async () => {
    const shouldClone = { cloned: 'data' };
    const mergedShouldClone = mergeOpts(shouldClone);
    assert.notEqual(mergedShouldClone, shouldClone);
    assert.ok(isEqual(mergedShouldClone, shouldClone));
  });
});
