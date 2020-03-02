import log from '../common/logger'
import { validate } from 'jsonschema'
import applyStep1Schema from './schema/applyStep1'
import applyStep2Schema from './schema/applyStep2'
import applyStep3Schema from './schema/applyStep3'
import signUpStep1Schema from './schema/signUpStep1'
import signUpStep2Schema from './schema/signUpStep2'
import signUpStep3Schema from './schema/signUpStep3'
import interestRequestSchema from './schema/interestRequest'

export default {

  schema: {
    applyStep1: applyStep1Schema,
    applyStep2: applyStep2Schema,
    applyStep3: applyStep3Schema,
    signUpStep1: signUpStep1Schema,
    signUpStep2: signUpStep2Schema,
    signUpStep3: signUpStep3Schema,
    interestRequest: interestRequestSchema
  },

  validate(data, schema) {

    log.info(data, 'Running validations')
    const validationErrors = validate(data, schema).errors

    // Validation failed
    if (validationErrors.length > 0) {
      log.info('Validation failed')
      log.debug(validationErrors)
      return {
        isValid: false,
        validationErrors: _simplifyValidationErrors(validationErrors)
      }
    }

    // Validation succeeded
    return { isValid: true }
  }
}

function _simplifyValidationErrors(validationErrors) {
  return validationErrors.map(error => {
    return {
      name: error.name,
      property: error.property.replace('instance.', ''),
      message: error.message
    }
  })
}
