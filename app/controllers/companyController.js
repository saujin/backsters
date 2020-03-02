import log from '../common/logger'
import config from '../config/config'
import companyRepository from '../dataAccess/repositories/companyRepository'
import * as errors from '../common/errors'
import validator from '../validation/validator'
import { Types } from 'mongoose'
import emailHelper from '../helpers/emailHelper'

export default {

  /**
   * Renders company list page.
   * @param   {Object}  req   Request
   * @param   {Object}  res   Response
   * @return  {void}
   */
  listAll(req, res) {

    companyRepository.findAll()
      .then(companies => {
        res.render('company/companyList', { companies })
      })
      .catch(err => {
        log.error(err, 'Cannot list companies')
        res.render('error')
      })
  },

  /**
   * Renders company detail page and writes it to the response.
   * @param   {Object}  req  Request
   * @param   {Object}  res  Response
   * @return  {void}
   */
  detail(req, res) {
    const companyId = req.params.companyId
    if (!Types.ObjectId.isValid(companyId)) {
      return res.render('error')
    }

    companyRepository.findById(companyId)
      .then(company => {

        const alreadyInterested = company.interests.filter(i => String(i.investorId) === req.user.id).length > 0
        const pageModel = {
          company: company,
          isCurrentUserInterested: alreadyInterested,
          visitorsCount: company.visitors ? company.visitors.length : 0,
          interestsCount: company.interests ? company.interests.length : 0
        }

        // not logged, proceed to rendering
        if (!req.user) {
          return pageModel
        }

        // add investor visit
        return companyRepository.saveVisitor(req.user.id, company.id)
          .then(result => {
            pageModel.visitorsCount = result.visitorsCount
            return pageModel
          })
      })
      .then(pageModel => {
        res.render('company/companyDetail', pageModel)
      })
      .catch(err => {
        log.error(err, 'Cannot display company detail')
        res.render('error')
      })
  },

  /**
   * Adds investor interest record to the company.
   * @param   {Object}    req   Request
   * @param   {Object}    res   Response
   * @param   {Function}  next  Next middleware
   * @return  {void}
   */
  addInterest(req, res, next) {

    const requestData = {
      companyId: req.params.companyId
    }

    // Validate incoming data
    const validationResult = validator.validate(requestData, validator.schema.interestRequest)
    if (!validationResult.isValid) {
      return res.sendValidationErrors(validationResult.validationErrors)
    }

    // Save interest
    const context = {}
    companyRepository.saveInterest(req.user.id, requestData.companyId)
      .then(result => {

        // Send info email
        context.interestCount = result.interestCount
        return emailHelper.sendInvestorInterestInfo({
          host: config.host,
          investor: result.investor,
          company: result.company
        })
      })
      .then(() => {

        // Send response to the client
        res.status(200).json({ success: true, interestCount: context.interestCount })
      })
      .catch(err => {
        log.error(err, 'Cannot write interest')
        next(new errors.DatabaseError('Cannot write interest'))
      })
  }

}