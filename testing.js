'use strict';

const SimplyCaching = require('simply-caching');

(async () => {
  const cache = new SimplyCaching();
  await cache.setCache('test', 'testdata');
  await cache.getCache('test');
  await cache.clearCache('');
})();
