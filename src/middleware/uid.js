const createUid = require('../core/uid')
const names = require('../constants/name')

// init clientId
module.exports = () => async (ctx, next) => {
  let uid = ctx.cookies.get(names.CLIENT_UID_NAME)
  if (!uid) {
    uid = createUid(ctx)
    ctx.cookies.set(names.CLIENT_UID_NAME, uid, { httpOnly: true })
  }
  
  // console.log(ctx.cookies.get)
  ctx.state.uid = uid
  return next()
}
