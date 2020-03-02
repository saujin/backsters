import log from '../common/logger'

/* eslint-disable no-unused-vars */

export const handle404 = (req, res, next) => {
  res.render('error404', { status: 404, url: req.url })
}

export const handleErrors = (err, req, res, next) => {
  log.error(err, 'Unhandled error occurred')

  const statusCode = err.status || 500
  const type = err.type || 'E_INTERNAL'
  const message = err.message || 'Something went wrong.'
  res.status(statusCode).json({ type, message })
}
