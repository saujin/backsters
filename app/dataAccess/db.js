import config from '../config/config'
import mongoose from 'mongoose'
import Promise from 'bluebird'
import log from '../common/logger'

import Company from './models/company'
import Investor from './models/investor'

// Setup mongoose to work with bluebird promises
mongoose.Promise = Promise

// Connect to the database
log.info('Connecting to the database.')
mongoose.connect(config.database.connectionString)

// Log connection status
const db = mongoose.connection
db.on('error', err => {
  log.error({ error: err })
})

db.once('open', () => {
  log.info('Database connection was successful.')
})

export default {
  Company,
  Investor
}
