import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    team: {
      type: 'array',
      items: {
        type: 'Object',
        properties: {
          name: { type: 'string', required: false, minLength: 0, maxLength: constants.SHORT_STRING },
          title: { type: 'string', required: false, minLength: 0, maxLength: constants.SHORT_STRING },
          linkedinProfileUrl: { type: 'string', required: false, minLength: 0, maxLength: constants.MEDIUM_STRING }
        }
      }
    }
  }
}
