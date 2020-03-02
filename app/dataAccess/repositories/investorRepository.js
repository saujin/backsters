import db from '../db'
import log from '../../common/logger'
import cryptoUtils from '../../common/cryptoUtils'

export default {

  createInvestorFromSignUpFlow(flowData) {

    log.debug(flowData, 'Creating investor from flow data.')
    const password = flowData.password
    return cryptoUtils.hashPassword(password)
      .then(passwordHash => {

        const investorData = Object.assign({}, flowData, { passwordHash })
        const newInvestor = new db.Investor(investorData)
        return newInvestor.save()
      })
  },

  findById(investorId) {
    return db.Investor.findOne({ _id: investorId }).exec()
  },

  findByEmail(email) {
    return db.Investor.findOne({ email }).exec()
  },

  authenticate(email, password) {

    log.info(`Authenticating user ${email}`)
    const context = {}

    return db.Investor.findOne({ email: email }).exec()
      .then(investor => {
        context.investor = investor

        if (!investor) {
          return false
        }

        return _isValidPassword(password, investor)
      })
      .then(isValid => {

        if (!isValid) {
          log.info('Authentication failed')
          return null
        }

        log.info('Authentication succeeded')
        return context.investor
      })
  }
}

function _isValidPassword(password, investor) {
  return cryptoUtils.comparePasswords(password, investor.passwordHash)
}
