const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();



router.get('/about',(req,res) =>{
	res.render('about');
});



module.exports = router; 