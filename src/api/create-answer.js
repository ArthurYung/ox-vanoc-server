const cache = require('../core/lru')
const errorCode = require('../constants/error-code')

module.exports = async (ctx) => {
  const postJson = ctx.request.body
  const { uid } = ctx.state
  if (!postJson || !postJson.sdp || postJson.type !== 'answer') {
    ctx.body = {
      code: errorCode.PARAMS_FAILED,
      message: errorCode.PARAMS_FAILED_MESSAGE
    }
    return
  }

  const offer = cache.get(uid)
  if (!offer || !offer.offer) {
    ctx.body = { 
      code: errorCode.NOT_FIND,
      message: errorCode.NOT_FIND_MESSAGE
    }

    return
  }

  offer.answer = postJson.sdp
  offer.status += 1
  ctx.body ={ code: 0, message: 'answer创建成功' }
}
