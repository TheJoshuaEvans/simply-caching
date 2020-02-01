# Simply Caching
Super simple in memory and file-based caching

# Installation
```
npm install --save simply-caching
```

# Usage
## Simple Example
```js
const SimplyCaching = require('simply-caching');

// Create a cache object with default settings
const cache = new SimplyCaching();

// Set an item into the cache
await cache.setCache('key', data);

// Get an item from the cache
const retrievedData = await cache.getCache('key');

// Clear an item form the cache
await cache.clearCache('key')
```
