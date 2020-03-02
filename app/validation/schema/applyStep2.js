import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    websiteUrl: { type: 'string', required: true, minLength: 1, maxLength: constants.MEDIUM_STRING },
    description: { type: 'string', required: true, minLength: 1, maxLength: constants.LONG_STRING },
    location: { type: 'string', required: true,  minLength: 1, maxLength: constants.SHORT_STRING },
    crunchbaseUrl: { type: 'string', required: false, minLength: 0, maxLength: constants.MEDIUM_STRING },
    angelcoUrl: { type: 'string', required: false, minLength: 0, maxLength: constants.MEDIUM_STRING },
    industry: {
      type: 'array',
      items: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING }
    }
  }
}
