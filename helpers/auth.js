helpers = {}

// Checks if the user is Authenticated
helpers.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
res.redirect('/admin/login')
}
// Checks if the user has admin privileges and if it is Authenticated
helpers.isAdmin = async (req, res, next) => {
  if (req.user.admin && req.isAuthenticated()) {
    console.log(req.user.admin)
    return next();
  }
res.redirect('/admin/')
}
module.exports = helpers
