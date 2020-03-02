import * as errors from '../common/errors'
import log from '../common/logger'
import validator from '../validation/validator'
import FormFlowHelper from '../helpers/formFlowHelper'
import emailHelper from '../helpers/emailHelper'
import investorRepository from '../dataAccess/repositories/investorRepository'
import config from '../config/config'

const flowDataDefault = {
  firstName: null,
  lastName: null,
  company: null,
  email: null,
  network: null,
  investmentStage: null,
  averageCheckSize: null,
  preferredIndustries: [],
  preferredGeographies: [],
  otherPreferences: null
}

const flowSessionPath = 'signUp'
const flowDataPath = 'formSignUp'
const flowViews = {
  STEP1: 'signUp/step1',
  STEP2: 'signUp/step2',
  STEP3: 'signUp/step3',
  FINAL: 'signUp/final'
}

const signUpFlow = FormFlowHelper(flowSessionPath, flowDataPath, flowDataDefault)

export default {

  start(req, res) {
    res.redirect('/signup/step1')
  },

  getStep1(req, res) {
    signUpFlow.renderStep(flowViews.STEP1, req, res)
  },

  getStep2(req, res) {
    signUpFlow.renderStep(flowViews.STEP2, req, res)
  },

  getStep3(req, res) {
    signUpFlow.renderStep(flowViews.STEP3, req, res)
  },

  getFinal(req, res) {
    signUpFlow.renderStep(flowViews.FINAL, req, res)
  },

  postStep1(req, res) {

    // Load data
    const stepData = req.body

    // Run common validations
    const validationResult = signUpFlow.validateStep(stepData, validator.schema.signUpStep1)
    if (!validationResult.isValid) {
      return res.sendValidationErrors(validationResult.validationErrors)
    }

    // Validate access code
    if (req.body.betaAccessCode !== config.betaAccessCode) {
      return res.sendValidationErrors([{
        name: 'invalid',
        property: 'betaAccessCode',
        message: 'Beta access code is invalid'
      }])
    }

    // Validate duplicate email
    investorRepository.findByEmail(stepData.email)
      .then(investor => {

        // investor already registered
        if (investor) {
          return res.status(200).json({
            success: false,
            validationErrors: [{
              name: 'duplicit',
              property: 'email',
              message: 'A user with this email is already registered'
            }]
          })
        }

        // Process incoming data
        signUpFlow.saveStepData(stepData, req.session)
        res.status(200).json({success: true})
      })
  },

  postStep2(req, res) {
    signUpFlow.processStep(validator.schema.signUpStep2, req, res)
  },

  postStep3(req, res, next) {

    // Load data
    const stepData = req.body

    // Run common validations
    const validationResult = signUpFlow.validateStep(stepData, validator.schema.signUpStep3)
    if (!validationResult.isValid) {
      return res.sendValidationErrors(validationResult.validationErrors)
    }

    // Save incoming data
    signUpFlow.saveStepData(stepData, req.session)

    // Save flow data to the database
    const flowData = signUpFlow.getFlowResult(req)
    investorRepository.createInvestorFromSignUpFlow(flowData)
      .then(investor => {
        signUpFlow.clean(req)

        // Send info email
        return emailHelper.sendInvestorRegistrationInfo({ host: config.host, investor })
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
