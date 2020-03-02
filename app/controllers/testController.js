import config from '../config/config'
import emailHelper from '../helpers/emailHelper'
import log from '../common/logger'
import templateHelper from '../helpers/templateHelper'
import investorRepository from '../dataAccess/repositories/investorRepository'
import companyRepository from '../dataAccess/repositories/companyRepository'
import Promise from 'bluebird'

const sample = {
  COMPANY_ID: '5667508445b5400f0082bd1c',
  INVESTOR_ID: '56669d1eed4bd90777075e27'
}

export default {

  version(req, res) {
    res.status(200).send(config.version)
  },

  test(req, res) {
    res.send('API configured correctly.')
  },

  testInvestorEmailTemplate(req, res) {

    return investorRepository
      .findById(sample.INVESTOR_ID)
      .then(investor => {
        return templateHelper.renderTemplateToString(`emails/investorRegistration`, { host: config.host, investor })
      })
      .then(emailHtml => {
        res.status(200).send(emailHtml)
      })
  },

  testCompanyEmailTemplate(req, res) {

    return companyRepository
      .findById(sample.COMPANY_ID)
      .then(company => {
        return templateHelper.renderTemplateToString(`emails/companyRegistration`, { host: config.host, company })
      })
      .then(emailHtml => {
        res.status(200).send(emailHtml)
      })
  },

  testInvestorInterestEmailTemplate(req, res) {
    return _getSampleInvestorInterestEmailData()
      .then(emailData => {
        return templateHelper.renderTemplateToString(`emails/investorInterest`, emailData)
      })
      .then(emailHtml => {
        res.status(200).send(emailHtml)
      })
  },

  testSendEmail(req, res) {
    log.info('Sending sample email')

    //const emailSendPromise = _testSampleEmail()
    //const emailSendPromise = _testCompanyRegistrationEmail()
    //const emailSendPromise = _testInvestorRegistrationEmail()
    const emailSendPromise = _testInvestorInterestEmail()

    _writeEmailSendResult(res, emailSendPromise)
  }
}

/* eslint-disable no-unused-vars */

function _testSampleEmail() {
  return emailHelper.sendTestEmail()
}

function _testInvestorInterestEmail() {
  return _getSampleInvestorInterestEmailData()
    .then(emailData => {
      return emailHelper.sendInvestorInterestInfo(emailData)
    })
}

function _testInvestorRegistrationEmail() {
  return investorRepository
    .findById(sample.INVESTOR_ID)
    .then(investor => {
      return emailHelper.sendInvestorRegistrationInfo({ host: config.host, investor })
    })
}

function _testCompanyRegistrationEmail() {
  return companyRepository
    .findById(sample.COMPANY_ID)
    .then(company => {
      return emailHelper.sendCompanyRegistrationInfo({ host: config.host, company })
    })
}

function _writeEmailSendResult(res, emailSendPromise) {
  emailSendPromise
    .then(result => {
      res.status(200).json({ success: result })
    })
    .catch(err => {
      log.error(err, 'Cannot send test email')
      res.status(500)
    })
}

function _getSampleInvestorInterestEmailData() {
  const sampleInvestor = investorRepository.findById(sample.INVESTOR_ID)
  const sampleCompany = companyRepository.findById(sample.COMPANY_ID)
  return Promise.all([ sampleInvestor, sampleCompany ])
    .spread((investor, company) => {
      return {
        host: config.host,
        investor,
        company
      }
    })
}
