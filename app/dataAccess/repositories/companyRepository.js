import Promise from 'bluebird'
import db from '../db'
import * as errors from '../../common/errors'
import log from '../../common/logger'
import escape from 'escape-html'

export default {

  /**
   * Creates a new company record from the data which were collected
   * during apply form flow.
   * @param {Object} flowData - The data collected during apply form flow.
   * @returns {Object} New company record.
   */
  createCompanyFromApplyFlow(flowData) {

    log.debug(flowData, 'Creating company from collected data.')
    const companyData = _extractCompanyFromFlowData(flowData)
    const company = new db.Company(companyData)
    return company.save()
  },

  /**
   * Returns all companies within the database.
   * @returns {Promise} Returns all companies from the database
   */
  findAll() {
    return db.Company.find().exec()
	},

  /**
   * Finds company by its identifier.
   * @param {string} companyId - Company identifier.
   * @returns {Object} Company
   */
  findById(companyId) {
    return _findSingleCompany(companyId)
  },

  /**
   * Adds investor interest to the company.
   * @param {string} investorId - Identifier of the investor who clicked on the "I am interested" button
   * @param {string } companyId - Identifier of the target company
   * @returns {Promise} Resolved promise contains investor, company and total interests count
   */
  saveInterest(investorId, companyId) {

    return Promise.all([
        db.Company.findOne({ _id: companyId }).exec(),
        db.Investor.findOne({ _id: investorId }).exec()
      ])
      .spread((company, investor) => {

        if (!company || !investor) {
          log.err({ company, investor }, 'Cannot add interest')
          throw errors.DatabaseError('Cannot add interest')
        }

        // find current interests
        const interests = company.interests || []
        const alreadyInterested = interests.filter(i => String(i.investorId) === investorId).length > 0

        // add new one
        if (alreadyInterested) {
          return { company, investor, interestCount: interests.length }
        }

        // save
        interests.push({ investorId: investorId })
        return company.save().then(() => {
          return { company, investor, interestCount: interests.length }
        })
      })
  },

  /**
   * The method saves visit of the investor on the company detail page. If the visitor has already
   * been on the page a new record is NOT created.
   * @param {string} investorId - Identifier of the investor
   * @param {string} companyId - Identifier of the company
   * @returns {Object} Object containing total number of visitors
   */
  saveVisitor(investorId, companyId) {
    return _findSingleCompany(companyId)
      .then(company => {

        // find current interests
        const visitors = company.visitors || []
        const alreadyCounted = visitors.filter(v => String(v.investorId) === investorId).length > 0

        // add new one
        if (alreadyCounted) {
          return { visitorsCount: visitors.length }
        }

        // save
        visitors.push({ investorId: investorId })
        return company.save().then(() => {
          return { visitorsCount: visitors.length }
        })
      })
  }
}

function _findSingleCompany(companyId) {
  return db.Company.findOne({ _id: companyId}).exec()
}

function _extractCompanyFromFlowData(flowData) {
  return {
    founderFirstName: flowData.firstName,
    founderLastName: flowData.lastName,
    email: flowData.email,
    phoneNumber: flowData.phoneNumber,
    name: flowData.company,
    websiteUrl: flowData.websiteUrl,
    description: escape(flowData.description),
    location: flowData.location,
    crunchbaseUrl: flowData.crunchbaseUrl,
    angelcoUrl: flowData.angelcoUrl,
    industry: flowData.industry,
    team: flowData.team.filter(t => t.firstName || t.lastName || t.title)
  }
}