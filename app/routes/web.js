import express from 'express'
import homeController from './../controllers/homeController'
import applyController from './../controllers/applyController'
import signUpController from './../controllers/signUpController'
import companyController from './../controllers/companyController'
import investorController from './../controllers/investorController'
import testController from './../controllers/testController'
import auth from '../middleware/authentication'
import config from '../config/config'

const router = express.Router()

// Test routes
if (!config.isProduction) {
  router.get('/test', homeController.test)
  router.get('/email/company', testController.testCompanyEmailTemplate)
  router.get('/email/investor', testController.testInvestorEmailTemplate)
  router.get('/email/interest', testController.testInvestorInterestEmailTemplate)
}

// Home route
router.get('/', homeController.index)
router.get('/terms-and-conditions', homeController.termsAndConditions)
router.get('/privacy-policy', homeController.privacyPolicy)

// Apply flow
router.get('/apply', applyController.start)
router.get('/apply/step1', applyController.getStep1)
router.get('/apply/step2', applyController.getStep2)
router.get('/apply/step3', applyController.getStep3)
router.get('/apply/final', applyController.getFinal)

// Sing up flow
router.get('/signup', signUpController.start)
router.get('/signup/step1', signUpController.getStep1)
router.get('/signup/step2', signUpController.getStep2)
router.get('/signup/step3', signUpController.getStep3)
router.get('/signup/final', signUpController.getFinal)

// Login
router.get('/login', investorController.renderLogin)
router.get('/profile', auth.isAuthenticated, investorController.profile)

// Company routes
router.get('/companies', auth.isAuthenticated, companyController.listAll)
router.get('/companies/:companyId', auth.isAuthenticated, companyController.detail)

export default router
