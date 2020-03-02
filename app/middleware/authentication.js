import log from '../common/logger'
import passport from 'passport'
import passportLocal from 'passport-local'
import investorRepository from '../dataAccess/repositories/investorRepository'
import * as errors from '../common/errors'

const Strategy = passportLocal.Strategy

passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true
  }, (email, password, done) => {

    log.info('Authenticating user with LocalStrategy')
    investorRepository.authenticate(email, password)
      .then(investor => {

        if (!investor) {
          log.info('Not authenticated')
          return done(null, false, { message: 'Invalid email or password.' })
        }

        log.info('Authenticated')
        return done(null, investor)
      })
      .catch(err => {
        log.error(err, 'Error during user authentication')
        return done(err)
      })
  }
))

passport.serializeUser((user, done) => {
  log.info('Serializing user')
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  log.info({ id: id }, 'Deserializing user')
  investorRepository.findById(id)
    .then(investor => {
      log.info('User deserialized')
      return done(null, investor)
    })
    .catch(err => {
      log.error(err, 'Cannot deserialize user')
      return done(err)
    })
})

export default {

  authenticate: passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: false
  }),

  authenticateAPI: function (req, res, next) {

    passport.authenticate('local', { failureFlash: false }, (err, user) => {

      // error occurred during authentication
      if (err) {
        return next(err)
      }

      // user authenticated
      if (!user) {
        return next(new errors.InvalidEmailPassword())
      }

      // authorize
      req.logIn(user, error => {
        if (error) {
          return next(error)
        }
        return next(null)
      })

     })(req, res, next)
  },

  initialize(app) {
    app.use(passport.initialize())
    app.use(passport.session())
  },

  isAuthenticated(req, res, next) {
    if (!req.user) {
      return res.redirect('/login')
    }

    return next()
  }
}
