import log from '../common/logger'
import templateHelper from './templateHelper'
import Sendgrid from 'sendgrid'
import config from '../config/config'
import Promise from 'bluebird'

const sendgrid  = Sendgrid(config.sendgrid.username, config.sendgrid.password);
const emails = {
  COMPANY_REGISTRATION: 'companyRegistration',
  INVESTOR_REGISTRATION: 'investorRegistration',
  INVESTOR_INTEREST: 'investorInterest'
}

export default {

  sendTestEmail() {
    return templateHelper.renderTemplateToString('emails/test', {})
      .then(emailHtml => {
        log.info('Configuring email')
        const subject = 'Backsters - test info'
        const from = 'info@strv.com'
        const to = 'josef.zavisek@strv.com'
        return _sendEmail(subject, from, to, emailHtml)
      })
      .then(result => {
        log.info({ result }, 'Email successfully sent.')
        return true
      })
      .catch(err => {
        log.err(err, 'Cannot send the test email')
        return false
      })
  },

  sendCompanyRegistrationInfo(data) {
    return _sendTemplateEmail(emails.COMPANY_REGISTRATION, data)
  },

  sendInvestorRegistrationInfo(data) {
    return _sendTemplateEmail(emails.INVESTOR_REGISTRATION, data)
  },

  sendInvestorInterestInfo(data) {
    return _sendTemplateEmail(emails.INVESTOR_INTEREST, data)
  }
}

function _sendTemplateEmail(emailName, emailData) {

  if (!config.emails.enabled) {
    return Promise.resolve(false)
  }

  const templateName = `emails/${emailName}`
  return templateHelper.renderTemplateToString(templateName, emailData)
    .then(emailHtml => {
      log.info('Configuring email.')

      const from = config.emails.notificationFrom
      const to = config.emails.notificationTo
      const subject = config.emails[emailName].subject

      return _sendEmail(subject, from, to, emailHtml)
    })
    .then(result => {
      log.info({ result }, 'Email successfully sent.')
      return true
    })
    .catch(err => {
      log.err(err, `Cannot send the template email. (templateName: ${templateName}, emailName: ${emailName})`)
      return false
    })
}

function _sendEmail(subject, from, to, emailHtml) {

  const email = {
    to: to,
    from: from,
    subject: subject,
    html: emailHtml
  }

  return new Promise((resolve, reject) => {
    sendgrid.send(email, (err, json) => {

      if (err) {
        log.error(err, 'Sendgrid send failed.')
        return reject(err)
      }

      log.info(json, 'Sendgrid send succeeded.')
      resolve(json)
    })
  })
}
