import mongoose, { Schema } from 'mongoose'
import constants from '../../common/constants'

const companySchema = new Schema({

  // founder info
  founderFirstName: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  founderLastName: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  email: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  phoneNumber: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },

  // company info
  name: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
  websiteUrl: { type: String, minlength: 1, maxlength: constants.MEDIUM_STRING },
  description: { type: String, minlength: 1, maxlength: constants.LONG_STRING },
  location: { type: String, minlength: 1, maxlength: constants.LONG_STRING },
  crunchbaseUrl: { type: String, minlength: 0, maxlength: constants.MEDIUM_STRING },
  angelcoUrl: { type: String, minlength: 0, maxlength: constants.MEDIUM_STRING },
  industry: [
    { type: String, minlength: 1, maxlength: constants.SHORT_STRING }
  ],

  // ids of investors that are interested in the company
  interests: [{
    investorId: { type: Schema.Types.ObjectId, ref: 'Investor' },
    createdAt: { type: Date, default: Date.now }
  }],

  // ids of investors that are visited the company detail
  visitors: [{
    investorId: { type: Schema.Types.ObjectId, ref: 'Investor' },
    createdAt: { type: Date, default: Date.now }
  }],

  // team
  team: [{
    name: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
    title: { type: String, minlength: 1, maxlength: constants.SHORT_STRING },
    linkedinProfileUrl: { type: String, minlength: 1, maxlength: constants.SHORT_STRING }
  }],

  note: { type: String, minlength: 0, required: false, maxlength: constants.LONG_STRING, default: '' },
  createdAt: { type: Date, default: Date.now }
})

const Company = mongoose.model('Company', companySchema)
export default Company