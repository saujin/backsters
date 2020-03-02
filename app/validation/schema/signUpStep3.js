import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    preferredIndustries: {
      type: 'array',
      items: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING }
    },
    preferredGeographies: {
      type: 'array',
      items: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING }
    },
    otherPreferences: { type: 'string', required: false, minLength: 0, maxLength: constants.MEDIUM_STRING }
  }
}