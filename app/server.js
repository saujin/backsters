import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import session from 'express-session'
import config from './config/config'
import apiRoutes from './routes/api'
import webRoutes from './routes/web'
import log from './common/logger'
import auth from './middleware/authentication'
import templateMiddleware from './middleware/templateMiddleware'
import requestLogging from './middleware/requestLogging'
import { handle404, handleErrors } from './middleware/errorHandling'
import responseExtension from './common/responseExtension'
import { Server } from 'http'

// Apply extensions
responseExtension(express)

// Init server
const app = express()
const server = Server(app)

// Setup view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Setup middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public/favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

if (config.logging.requestLoggingEnabled) {
  app.use(requestLogging)
}

// Setup session & authentication
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
}))
auth.initialize(app)

// Set data accessible to all templates
app.use(templateMiddleware.setTemplateLocals)

// Setup routes
app.use('/', webRoutes)
app.use('/api', apiRoutes)

// Error handling
app.use(handle404)
app.use(handleErrors)

// Start listening
server.listen(config.port, () => {
  log.info(`Server started at port ${config.port}`)
})
