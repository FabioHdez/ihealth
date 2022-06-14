helpers = {}

helpers.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
res.redirect('/admin/login')
}
module.exports = helpers
