import express from 'express'
import testController from './../controllers/testController'
import companyController from './../controllers/companyController'
import applyController from './../controllers/applyController'
import signUpController from './../controllers/signUpController'
import investorController from './../controllers/investorController'
import auth from '../middleware/authentication'
import config from '../config/config'

const router = express.Router()

// Routes for testing purposes
if (!config.isProduction) {
  router.get('/testEmail', testController.testSendEmail)
}

// Routes for API validation
router.get('/', testController.test)
router.get('/version', testController.version)

// Company routes
router.post('/companies/:companyId/interest', auth.isAuthenticated, companyController.addInterest)

// Apply flow
router.post('/apply/step1', applyController.postStep1)
router.post('/apply/step2', applyController.postStep2)
router.post('/apply/step3', applyController.postStep3)

// SignUp flow
router.post('/signup/step1', signUpController.postStep1)
router.post('/signup/step2', signUpController.postStep2)
router.post('/signup/step3', signUpController.postStep3)

router.post('/login', auth.authenticateAPI, investorController.login)
router.post('/logout', auth.isAuthenticated, investorController.logout)

export default router
