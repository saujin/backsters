import log from '../common/logger'
import templateHelper from '../helpers/templateHelper'

export default {

  renderLogin(req, res) {
    res.render('investor/login')
  },

  login(req, res) {
    log.info('Redirecting to the profile page')
    log.debug(req.user, 'Logged user')

    templateHelper.renderTemplateToString('partials/userPanel', { user: req.user })
      .then(loginPartial => {
        res.status(200).send({
          success: true,
          isLogged: true,
          user: req.user,
          userPanel: loginPartial
        })
      })
      .catch(err => {
        log.error(err, 'Cannot render user panel')
        res.status(200).send({
          success: false
        })
      })
  },

  logout(req, res) {
    log.info('User logged out')

    req.session.destroy()
    req.logout()
    res.status(200).send({
      success: true,
      isLogged: false
    })
  },

  profile(req, res) {
    log.info('Rendering the profile page')
    res.render('investor/profile')
  }
}
