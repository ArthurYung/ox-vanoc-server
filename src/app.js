const Koa = require('koa')
const path = require('path')
const cors = require('@koa/cors')
const views = require('koa-views')
const router = require('./routes')
const initUid = require('./middleware/uid')
const bodyParser = require('koa-bodyparser')
const socket = require('./api/websocket')

const app = new Koa();

if (process.env.NODE_ENV === 'dev') {
  console.log('cors')
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
} else {
  app.use(cors({
    origin: 'https://ox.bruceau.plus',
    credentials: true
  }))
}


app.use(views(path.resolve(__dirname, 'views'), {
  extension: 'pug'
}))

app.use(initUid())
app.use(bodyParser())
app.use(router.routes());

socket(
  app.listen(3008, () => {
    console.log('App start listen: http://localhost:3008')
  })
)
