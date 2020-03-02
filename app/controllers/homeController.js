export default {

  index(req, res) {
    res.render('index')
  },

  termsAndConditions(req, res) {
    res.render('termsAndConditions')
  },

  privacyPolicy(req, res) {
    res.render('privacyPolicy')
  },

  test(req, res) {
    res.render('test')
  }
}
