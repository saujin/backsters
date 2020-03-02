import log from '../common/logger'
import validator from '../validation/validator'

export default function (sessionKey, formDataPath, defaultFlowData) {

  const getFlowData = function(session) {
    return session[sessionKey] || defaultFlowData
  }

  const helper = {}

  /**
   * Validates incoming data with JSON-schema validator
   * @param   {Object}  stepData        Data to validate
   * @param   {Object}  stepDataSchema  JSON-schema definition
   * @return  {Object}  Validation result
   */
  helper.validateStep = function(stepData, stepDataSchema) {

    log.info(stepData, 'Running validations')
    const result = validator.validate(stepData, stepDataSchema)
    if (!result.isValid) {
      log.info('Validation failed')
      log.debug(result.validationErrors)
      return { isValid: false, validationErrors: result.validationErrors }
    }

    return { isValid: true }
  }

  /**
   * Saves step data into the session
   * @param   {Object}  stepData  Data to save
   * @param   {Object}  session   Current session
   * @return  {void}
   */
  helper.saveStepData = function(stepData, session) {
    const currentFlowData = getFlowData(session)
    const newFlowData = Object.assign({}, currentFlowData, stepData)
    const logObj = Object.assign({}, newFlowData, { password: null })
    log.debug(logObj, 'New flow data dump')
    session[sessionKey] = newFlowData
  }

  /**
   * Validates incoming data and saves step data into the session
   * @param   {Object}  stepDataSchema  Step data schema
   * @param   {Object}  req   Request
   * @param   {Object}  res   Response
   * @return  {void}
   */
  helper.processStep = function(stepDataSchema, req, res) {

    // Load data
    const stepData = req.body

    // Run validation
    const validationResult = this.validateStep(stepData, stepDataSchema)
    if (!validationResult.isValid) {
      return res.sendValidationErrors(validationResult.validationErrors)
    }

    // Save and return
    this.saveStepData(stepData, req.session)
    res.status(200).json({success: true})
  }

  /**
   * Renders view for the current flow step providing it with step data
   * @param   {string}  stepView  Path to the step template
   * @param   {Object}  req   Request
   * @param   {Object}  res   Response
   * @return  {void}
   */
  helper.renderStep = function(stepView, req, res) {
    log.info(`Rendering step view ${stepView}`)

    const stepData = getFlowData(req.session)
    const pageModel = {
      [formDataPath]: stepData
    }

    res.render(stepView, pageModel)
  }

  /**
   * Returns data that were collected during form flow
   * @param   {Object}  req   Request
   * @return  {Object}  Collected data
   */
  helper.getFlowResult = function(req) {
    log.info('Returning flow result')

    const result = req.session[sessionKey]
    log.debug(result, 'Flow result dump')

    return result
  }

  /**
   * Cleans data from session related to the current flow
   * @param   {Object}  req   Request
   * @return  {void}
   */
  helper.clean = function(req) {
    req.session[sessionKey] = null
  }

  return helper
}
