#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js'
import debugMessage from 'debug'
import http from 'http'
import { shutDown } from '../utilities/serverUtils/shutDown.js'
import config from '../config/index.js'
import mongoose from 'mongoose'

const debug = debugMessage('planetx-blockchain-dgt-backend:server')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
  console.log('SERVER LISTENING ON PORT ' + addr.port)
  mongoose.connect(config.DATABASE.MONGO.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection

  db.on('connecting', () => {
    console.log('MONGO-DB DATABASE CONNECTED')
    // logger.info({ message: 'MongoDB Connecting' })
  })

  db.once('open', async () => {
    console.log('MONGO-DB DATABASE CONNECTED')
    // logger.info({ message: 'MongoDB connected' })
    // await syncAllModel()
  })
}

process.on('SIGTERM', () => {
  // console.log('SIGTERM')
  shutDown(false)
})

process.on('SIGINT', () => {
  // console.log('SIGINT')
  shutDown(false)
})

export default server
