const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();

const Image = require('../models/Image');




router.get('/upload', (req,res) => {
	res.render('admin/upload');
	//ruta para mostrar la imagen ya cargada
});

router.post('/upload', async (req,res) => { 
	const image = new Image();
	image.title = req.body.title;
	image.description = req.body.description;
	image.filename = req.file.filename;
	image.path = '/img/uploads/' + req.file.filename;
	image.originalname = req.file.originalname;
	image.mimetype = req.file.mimetype;
	image.size = req.file.size;
	
	await image.save();

	res.redirect('/');
	
	//ruta para guardar la imagen
});

router.get('/admin/:id', async (req,res) => {
	const { id } = req.params;
	const image = await image.findById(id);

	//ruta para elegir la imagen que sera remplazada
});

router.get('/admin/:id/upload', (req,res) => {
	res.send('Image Upload');
	//ruta para mostrar la imagen ya cargada
});

module.exports = router; 