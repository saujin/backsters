import constants from '../../common/constants'

export default {
  type: 'Object',
  properties: {
    investmentStage: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING },
    averageCheckSize: { type: 'string', required: true, minLength: 1, maxLength: constants.SHORT_STRING }
  }
}