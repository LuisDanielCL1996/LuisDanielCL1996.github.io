const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin',(req,res) => {
	res.render('users/signin');
}); 
router.post('/users/signin', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/users/signin',
	failureFlash: true
}));

router.get('/users/signup',(req,res) => {
	res.render('users/signup');
});

router.post('/users/signup', async (req,res) => {
	const { name, email, password, confirm_password } = req.body;
	const errors= [];

	if(name.length <=0){
		errors.push({ text: 'Please Insert  your Name'});
	}
	if(email.length <=0){
		errors.push({ text: 'Please Insert  your Email'});
	}
	if(password.length <=0){
		errors.push({ text: 'Please Insert  your Password'});
	}
	if(confirm_password.length <=0){
		errors.push({ text: 'Please Insert  the confirm Password'});
	} else {
		if (password.length < 4) {
		errors.push({ text: 'Password must be at least 4 characters'});
	}
	} 
	if (password != confirm_password) {
		errors.push({text: 'Password do not match'});
	}
	
	if (errors.length > 0) {
		res.render('users/signup', {errors, name, email, password, confirm_password});
	} else	{

		const emailUser = await User.findOne({email: email});
		if (emailUser) {
			req.flash('error_msg', 'The Email is already in use');
			res.redirect('/users/signup');
		}
		const newUser = new User({name, email, password});
		 newUser.password = await newUser.encryptPassword(password);
		await newUser.save();  
		req.flash('success_msg','You are registered');
		res.redirect('/users/signin');
	}
	
});

router.get('/users/logout', (req,res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router; 