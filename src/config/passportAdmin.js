const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Admin = require('../models/admin');

passport.use("login", new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (email, password, done) => {
	const admin = await Admin.findOne({email: email});
	if (!admin) {
		return done(null, false, {message: 'Not User found.'});
	} else {
		const match = await admin.matchPassword(password);
		if (match) {
			return done(null, admin);
		} else {
			return done(null, false, {message: 'Incorrect Password'});
		}
	}
}));


passport.serializeUser((admin,done) => {
	done(null, admin.id);
});

passport.deserializeUser((id, done) => {
	Admin.findById(id, (err, admin) => {
		done(err, admin);
	})
});