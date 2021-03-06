# Simply Caching
Super simple caching system. Designed to be lightweight and easy to use

# Installation
```
npm install --save simply-caching
```

# Simple Example
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

# Methods
This module uses promises and is designed to be used with the `async/await` pattern

Instances of this module only have three methods: `setCache`, `getCache`, and `clearCache`. Every method requires a string "key" as its first parameter, and the `setCache` method takes a "data" object as its second parameter. Each method also takes an "opts" parameter that can be used to overwrite configurations set on the parent instance

## [setCache](./src/control/set-cache.js)
```js
await setCache(key, data, opts = {}) 
```
The `setCache` method saves the provided data to the cache. Only object, number, and string data types are explicitly supported by all cache types

Throws an error if `general.overwrite` is set to `false` and data with the provided key already exists in the cache

## [getCache](./src/control/get-cache.js)
```js
const cachedData = await getCache(key, opts = {})
```
The `getCache` method retrieves data from the cache with a provided key. If multiple caches are enabled, the caches will be searched in order until the data is found and returned

Throws an error if data with the provided key cannot be found after searching all enabled caches

## [clearCache](./src/control/clear-cache.js)
```js
await clearCache(key, opts = {})
```
The `clearCache` method removes data from the cache with the provided key. If the empty string (`''`) is provided, all of the cached data in the configured cache root will be cleared

# Configuration
When creating a new cache instance, you can pass an object to the constructor with the following configurations. See the [default config file](./.simplycachingrc.default.js) for object formatting, documentation, and default values

# Cache Types
This module can use a few different methods of caching data. Use the `general.caches` configuration to choose which methods you wish to use. The order of the provided array will determine which caches are searched first when getting data. Set and clear operations are always performed asynchronously

## Memory
Methods: [set](./src/units/save-to-memory.js) | [get](./src/units/get-from-memory.js) | [clear](./src/units/clear-memory.js)

Enabled by default

The `memory` cache type stores data within an in-memory object. This data object can be made mutable with the `memory.mutable` option, meaning the data can be changed from outside the cache. The `memory.static` option can be set to use a static memory store that can share information between cache instances

## File - Enabled by default
Methods: [set](./src/units/save-to-file.js) | [get](./src/units/get-from-file.js) | [clear](./src/units/clear-file.js)

Enabled by default

The `file` cache type stores data in the local file system. By default, files will be stored alongside the module's install location (typically within the `node_moduels` directory). Use the `file.root` configuration to define your own cache directory. It is recommended that absolute paths are used. If a relative path is provided, the path will be made relative to the current working directory. Note that this cache type **will alter** files not made by this module
