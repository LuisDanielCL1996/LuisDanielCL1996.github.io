const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();


const Admin = require('../models/admin');

const passport = require('passport');

const { adminAuthenticated } = require('../helpers/authAdmin');



router.get('/admin/Signin',(req,res) => {
	//Login de adminisitrador
	res.render('admin/Signin');
});

router.post('/admin/Signin', passport.authenticate('login',  {
	successRedirect: '/admin',
	failureRedirect: '/admin/Signin',
	failureFlash: true
}));

router.get('/admin/Signup',adminAuthenticated, (req,res) =>{
	res.render('admin/Signup');
});

router.post('/admin/Signup', adminAuthenticated, async(req,res) =>{
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
		res.render('admin/Signup', {errors, name, email, password, confirm_password});
	} else	{
		const emailAdmin = await Admin.findOne({email: email});
		if (emailAdmin) {
			req.flash('error_msg', 'The Email is already in use');
			res.redirect('/admin/Signup');
		} else {
			const newAdmin = new Admin({name, email, password});
			newAdmin.password = await newAdmin.encryptPassword(password);
			await newAdmin.save();  
			req.flash('success_msg','You are registered');
			res.redirect('/admin/Signin');
		}
		
		
		
	}
});

router.get('/admin/logout',(req,res) =>{
	req.logout();
	res.redirect('/');
});


module.exports = router; 