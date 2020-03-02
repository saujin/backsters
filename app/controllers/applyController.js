import * as errors from '../common/errors'
import log from '../common/logger'
import validator from '../validation/validator'
import FormFlowHelper from '../helpers/formFlowHelper'
import companyRepository from '../dataAccess/repositories/companyRepository'
import emailHelper from '../helpers/emailHelper'
import config from '../config/config'

const flowDataDefault = {
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  companyName: null,
  websiteUrl: null,
  description: null,
  location: null,
  crunchbaseUrl: null,
  angelcoUrl: null,
  industry: [],
  team: []
}

const flowSessionPath = 'apply'
const flowDataPath = 'formApply'
const flowViews = {
  STEP1: 'apply/step1',
  STEP2: 'apply/step2',
  STEP3: 'apply/step3',
  FINAL: 'apply/final'
}

const applyFlow = FormFlowHelper(flowSessionPath, flowDataPath, flowDataDefault)

export default {

  start(req, res) {
    res.redirect('/apply/step1')
  },

  getStep1(req, res) {
    applyFlow.renderStep(flowViews.STEP1, req, res)
  },

  getStep2(req, res) {
    applyFlow.renderStep(flowViews.STEP2, req, res)
  },

  getStep3(req, res) {
    applyFlow.renderStep(flowViews.STEP3, req, res)
  },

  getFinal(req, res) {
    applyFlow.renderStep(flowViews.FINAL, req, res)
  },

  postStep1(req, res) {
    applyFlow.processStep(validator.schema.applyStep1, req, res)
  },

  postStep2(req, res) {
    applyFlow.processStep(validator.schema.applyStep2, req, res)
  },

  postStep3(req, res, next) {

    // Load data
    const stepData = req.body

    // Run validation
    const validationResult = applyFlow.validateStep(stepData, validator.schema.applyStep3)
    if (!validationResult.isValid) {
      return res.sendValidationErrors(validationResult.validationErrors)
    }

    // Process incoming data
    applyFlow.saveStepData(stepData, req.session)

    // Save flow data to the database
    const flowData = applyFlow.getFlowResult(req)
    companyRepository.createCompanyFromApplyFlow(flowData)
      .then(company => {

        // Clean session data
        applyFlow.clean(req)

        // Send info email
        return emailHelper.sendCompanyRegistrationInfo({ host: config.host, company })
      })
      .then(() => {
        res.status(200).json({success: true})
      })
      .catch(err => {
        log.error(err, 'Error occurred when saving company')
        next(new errors.DatabaseError())
      })
  }
}
