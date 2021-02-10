const webSocket = require('ws')
const cache = require('../core/lru')

const MAX_CONNECT_SIZE = 5000
const socketRoomMap = new Map()

const initSocketRoom = uid => {
  socketRoomMap.get(uid) || socketRoomMap.set(uid, {})
}

const setSocketRoom = (uid, type, ws) => {
  const socketRoom = socketRoomMap.get(uid) || {}
  if (socketRoom[type]) {
    try {
      socketRoom[type].close()
    } catch(e) {
      //
    }
  }

  socketRoom[type] = ws
}

const hasConnectedRoom = (uid) => {
  const connectRoom = socketRoomMap.get(uid)
  return (connectRoom.client && connectRoom.mobile) 
}

const sendMessage = (uid, type, content) => {
  try {
    const socketRoom = socketRoomMap.get(uid)
    const action = type === 'client' ? socketRoom.mobile : socketRoom.client
    action.send(content)
  } catch (e) {
    console.warn('send error:', e)
  }
}

const closeRoom = (uid) => {
  const roomInfo = socketRoomMap.get(uid)
  if (roomInfo) {
    if (roomInfo.mobile) {
      roomInfo.mobile.close()
      roomInfo.mobile = null
    }
    
    if (roomInfo.client) {
      roomInfo.client.close()
      roomInfo.client = null
    }

    socketRoomMap.delete(uid)
  }
}

module.exports = function createSocket(server) {

  const socketServer = new webSocket.Server({ noServer: true })
  
  socketServer.on('connection', function connection(ws, uid, type) {
    setSocketRoom(uid, type, ws)
    ws._room_type = type
    ws._room_id = uid
    
    ws.on('message', function incoming(message) {
      sendMessage(this._room_id, this._room_type, message)
    })

    ws.on('close', function onclose() {
      closeRoom(this._room_id)
    })
  })

  server.on('upgrade', (request, socket, head) => {
    console.log('update')
    const urlParsed = request.url.match(/^\/ws\/\?uid=(.+)?&type=(.+)$/)
    if(!urlParsed) {
      console.log(urlParsed, request.url)
      socket.write('HTTP2.0 404 not find\r\n\r\n')
      socket.destroy()
      return
    }

    if (socketRoomMap.size > MAX_CONNECT_SIZE) {
      socket.write('HTTP2.0 405 max register\r\n\r\n')
      socket.destroy()
      console.warn('[socket]', 'max connection')
    }

    const [_, uid, type] = urlParsed
    // const connectInfo = cache.get(uid)
    // if (!connectInfo) {
    //   socket.write('HTTP2.0 401 check fail\r\n\r\n')
    //   socket.destroy()
    //   return
    // }

    initSocketRoom(uid)
    if (hasConnectedRoom(uid)) {
      socket.write('HTTP2.0 401 room is connected\r\n\r\n')
      socket.destroy()
      return
    }

    socketServer.handleUpgrade(request, socket, head, function done(ws) {
      socketServer.emit('connection', ws, uid, type);
    });
  })
}
