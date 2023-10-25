import socketio from 'socket.io'
import socketManager from './socket'

import app from './app'

const port = process.env.PORT || 5001

socketManager(new socketio.Server(app.listen(port, () => console.log(`listen on :${port}`))))
