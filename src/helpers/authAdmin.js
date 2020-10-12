const ayudas = {};

ayudas.adminAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error_msg','Not Authorized');
	res.redirect('/admin/Signin');
};
 

 module.exports = ayudas;