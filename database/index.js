'use strict'

import mongoose from 'mongoose'
import logger from '../utilities/logger.js'
import config from '../config/index.js'
import { shutDown } from '../utilities/serverUtils/shutDown.js'
import { websiteModels } from '../models/websiteModels.js'
import { pageModels } from '../models/pageModels.js'
import { keyModel } from '../models/keyModels.js'
import { languageModels } from '../models/languageModels.js'

mongoose.connect(config.DATABASE.MONGO.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// mongoose.set('debug', true)

const db = mongoose.connection

db.on('connecting', () => {
  logger.info({ message: 'MongoDB Connecting' })
})

db.once('open', () => {
  console.log('MONGO-DB DATABASE CONNECTED')
  logger.info({ message: 'MongoDB connected' })
})

db.on('disconnecting', () => {
  logger.warn({ message: 'MongoDB Disconnecting' })
})

db.on('disconnected', () => {
  logger.warn({ message: 'MongoDB Disconnected' })
})

db.on('close', () => {
  logger.warn({ message: 'MongoDB Connection Closed Successfully!' })
})

db.on('reconnected', () => {
  logger.warn({ message: 'MongoDB Reconnected' })
})

db.on('reconnectFailed', () => {
  logger.warn({ message: 'MongoDB Reconnect Failed' })
})

db.on('error', (err) => {
  logger.error({ message: `MongoDB connection error - ${err.toString()}` })
  shutDown(true)
})

const syncAllModel = async () => { // Sync Model
  try {
    await Promise.all([
      websiteModels.syncIndexes(),
      pageModels.syncIndexes(),
      keyModel.syncIndexes(),
      languageModels.syncIndexes()

    ])
  } catch (error) {
    logger.debug(error)
  }
}

export default db
