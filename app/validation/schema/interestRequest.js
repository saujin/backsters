import constants from '../../common/constants'

export default {
  'name': 'Object',
  'properties': {
    companyId: { type: 'string', required: true, minLength: constants.ID_STRING_LENGTH, maxLength: constants.ID_STRING_LENGTH }
  }
}