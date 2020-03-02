
export default {

  /**
   * Initializes variables that are accessible to all views
   * @param   {Object}    req   Request
   * @param   {Object}    res   Response
   * @param   {Function}  next  Next middleware callback
   * @return  {void}
   */
  setTemplateLocals(req, res, next) {
    res.locals.isLogged = Boolean(req.user)
    res.locals.user = req.user
    next()
  }
}
