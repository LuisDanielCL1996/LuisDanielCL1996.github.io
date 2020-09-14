const express = require('express');//objeto que me facilitara la creacion de rutas  

const router = express.Router();
router.get('/', (req,res) => { //cuando visiten la pagina principal de mi app 
	res.render('index');			//donde veras un mensaje que diga "Index"
});

router.get('/about',(req,res) =>{
	res.render('about');
})

module.exports = router; 