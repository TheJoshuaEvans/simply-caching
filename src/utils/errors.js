'use strict';

/**
 * @extends Error
 * 
 * Error used when validation fails. Has the following extra members:
 * - issues: An array of validation error details
 */
class ValidationError extends Error {
  /**
   * @param {string[]|string} issues The validation error(s)
   */
  constructor(issues) {
    if (typeof issues === 'string') issues = [ issues ];
    super(issues.join('\n'));
    this.issues = issues;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @extends Error
 * 
 * Error used when cache operations fail. Has the following extra members:
 * - key: The key that caused the error
 * - data: The data being transferred. Null when no data is availabe
 */
class CacheError extends Error {
  /**
   * @param {string} msg Error message
   * @param {string} key The key that was being used when the error occurred
   * @param {string} data Data being transferred when the error occurred
   */
  constructor(msg, key, data = null) {
    super(msg);
    this.key = key;
    this.data = data;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ValidationError,
  CacheError
};
