const cache = require('../core/lru')
const errorCode = require('../constants/error-code')

module.exports = async (ctx) => {
  const postJson = ctx.request.body
  const { uid } = ctx.state

  if (!postJson) {
    ctx.body = {
      code: errorCode.PARAMS_FAILED,
      message: errorCode.PARAMS_FAILED_MESSAGE
    }
    return
  }

  const offer = cache.get(uid)

  if (!offer) {
    ctx.body = { 
      code: errorCode.NOT_FIND,
      message: errorCode.NOT_FIND_MESSAGE
    }

    return
  }

  if (!offer.answer && postJson.answer) {
    offer.answer = postJson.answer
    offer.status += 2
  }

  if (postJson.candidate1) {
    offer.candidate1.push(postJson.candidate1)
    offer.status += 10
  }

  if (postJson.candidate2) {
    offer.candidate2.push(postJson.candidate2)
    offer.status += 10
  }

  if (postJson.upgrade) {
    offer.upgrade = postJson.upgrade
    offer.status = 2
  }

  if (postJson.status) {
    offer.status = postJson.status
  }

  ctx.body = { code: 0, message: '更新成功' }
}
