const crypto = require('crypto')
const { clientIp } = require('./util')

module.exports = (ctx) => {
  const timestamp = Date.now()
  const ip = clientIp(ctx)
  return crypto
    .createHash('md5')
    .update(ip)
    .update(timestamp.toString())
    .digest('hex')
};
