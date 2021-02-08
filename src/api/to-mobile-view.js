const cache = require('../core/lru')
const names = require('../constants/name')

module.exports = async (ctx) => {
  const { uid } = ctx.params
  const offer = cache.get(uid)
  // await ctx.render('toMobile', {...offer, base: uid })
  // return
  if (!offer) {
    ctx.type = 'html'
    ctx.res.statusCode = 403
    ctx.res.write('二维码已过期，请重试')
    ctx.res.end()
  } else {
    ctx.cookies.set(names.CLIENT_UID_NAME, uid, { httpOnly: true })
    await ctx.render('ox', {...offer, base: uid, env: process.env.NODE_ENV })
  }
}
