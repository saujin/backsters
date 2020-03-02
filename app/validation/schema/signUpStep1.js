import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    betaAccessCode: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING },
    firstName: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING },
    lastName: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING  },
    company: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING  },
    email: {
      type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING,
      pattern: constants.EMAIL_PATTERN
    },
    password: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING  },
    network: { type: 'string', required: false, minLength: 0, maxLength: constants.SHORT_STRING }
  }
}
