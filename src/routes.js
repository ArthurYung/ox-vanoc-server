const Router = require('koa-router')
const createOffer = require('./api/create-offer')
const checkAnswer = require('./api/check-answer')
const createAnswer = require('./api/create-answer')
const toMobileView = require('./api/to-mobile-view')
const fromMobileView = require('./api/from-mobile-view')
const updateIce = require('./api/update-ice')
const cleanOffer = require('./api/delete-offer')

const router = new Router()

router.post('/offer', createOffer)
router.get('/check', checkAnswer)
router.get('/clean', cleanOffer)

router.post('/update', updateIce )

router.get('/ox/:uid', toMobileView)
router.get('/xo/:uid', fromMobileView)

module.exports = router
