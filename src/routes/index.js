const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();

const Image = require("../models/Image");


router.get('/about', async(req,res) =>{
	const image = await Image.find();
	res.render('about',{ image });
});



module.exports = router; 