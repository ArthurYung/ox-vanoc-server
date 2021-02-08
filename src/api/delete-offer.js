const cache = require('../core/lru')


module.exports = async (ctx) => {
  const { uid } = ctx.state
  cache.del(uid)
  ctx.body ={ code: 0, message: '删除成功' }
}
