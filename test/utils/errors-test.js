'use strict';

const assert = require('assert');

const { ValidationError, CacheError } = require('../../src/utils/errors.js');

describe('errors', () => {
  describe('ValidationError', () => {
    it('should instantiate with array', () => {
      const invalid = [
        'first',
        'second'
      ];
    
      const validationError = new ValidationError(invalid);
    
      assert.ok(validationError.message.includes(invalid[0]));
      assert.ok(validationError.message.includes(invalid[1]));
      assert.equal(validationError.issues, invalid);
    });

    it('should instantiate with string', () => {
      const invalid = 'a single string';
    
      const validationError = new ValidationError(invalid);
    
      assert.ok(validationError.message.includes(invalid));
      assert.equal(validationError.issues, invalid);
      assert.equal(validationError.name, 'ValidationError');
    });
  });

  describe('CacheError', () => {
    it('should instantiate correctly', () => {
      const cacheError = new CacheError('cache error message', 'key', 'data');

      assert.ok(cacheError.message.includes('cache error message'));
      assert.equal(cacheError.key, 'key');
      assert.equal(cacheError.data, 'data');
      assert.equal(cacheError.name, 'CacheError');
    });

    it('should instantiate correctly with no "data" parameter', () => {
      const cacheError = new CacheError('cache error message', 'key');

      assert.ok(cacheError.message.includes('cache error message'));
      assert.equal(cacheError.key, 'key');
      assert.strictEqual(cacheError.data, null);
      assert.equal(cacheError.name, 'CacheError');
    });
  });
});
