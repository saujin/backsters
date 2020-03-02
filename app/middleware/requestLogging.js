import log from '../common/logger'

export default function(req, res, next) {

  log.debug({ req }, 'Server request')
  res.once('finish', () => log.debug({ res }, 'Server response'))

  next()
}