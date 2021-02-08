const cache = require('../core/lru')
const errorCode = require('../constants/error-code')

module.exports = async (ctx) => {
  const { uid } = ctx.state
  const { base } = ctx.query
  const data = cache.get(uid)
  if (!data) {
    ctx.body = { code: errorCode.NOT_FIND, message: errorCode.NOT_FIND_MESSAGE }
    return
  }

  ctx.body = { code: 0, data, message: '' }
}
