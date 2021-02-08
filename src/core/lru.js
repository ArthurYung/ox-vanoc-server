const LRU = require('lru-cache')

const cache = new LRU({
  max: 5000,
  maxAge: 1000 * 60 * 60 * 2
})

module.exports = cache
