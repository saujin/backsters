import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    firstName: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING },
    lastName: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING  },
    company: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING  },
    email: {
      type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING,
      pattern: constants.EMAIL_PATTERN
    },
    phoneNumber: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING }
  }
}
