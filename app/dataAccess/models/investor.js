import mongoose from 'mongoose'
import constants from '../../common/constants'

const investorSchema = new mongoose.Schema({
  firstName: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  lastName: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  company: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  email: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  passwordHash: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  network: { type: String, minlength: 0, maxlength: constants.SHORT_STRING },
  investmentStage: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  averageCheckSize: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  preferredIndustries: [{
    type: String, minlength: 1, maxlength: constants.SHORT_STRING
  }],
  preferredGeographies:[{
    type: String, minlength: 1, maxlength: constants.SHORT_STRING
  }],
  otherPreferences: { type: String, minlength: 0, maxlength: constants.LONG_STRING },
  createdAt: { type: Date, default: Date.now }
})

const Investor = mongoose.model('Investor', investorSchema)
export default Investor