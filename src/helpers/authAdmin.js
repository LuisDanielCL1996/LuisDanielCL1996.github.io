const ayudas = {};

ayudas.adminAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "Not Authorized");
  res.redirect("/upload/signin");
};

module.exports = ayudas;
