import bunyan from 'bunyan'
import config from '../config/config'
import logentries from 'le_node'

const logStreams = []

// console stream
logStreams.push({
  name: 'console',
  level: 'debug',
  stream: process.stdout
})

// log entries stream
if (config.logging.logentriesToken) {
  logStreams.push(
    logentries.bunyanStream({
      token: config.logging.logentriesToken
    })
  )
}

// initialize logger
const logger = bunyan.createLogger({
  name: config.appName,
  streams: logStreams,
  serializers: bunyan.stdSerializers
})

export default logger