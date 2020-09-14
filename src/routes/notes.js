const express = require('express');//objeto que me facilitara la creacion de rutas  
const router = express.Router();

const Note = require('../models/Note'); //Para manipular la DB
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add',isAuthenticated, (req,res) => {
	res.render('notes/new-note');
}); 

router.post('/notes/new-note', isAuthenticated, async (req,res) => {
 	const { title, description } =req.body; 
 	// obteniendo los valores por separado que el usuario mando
 	const errors = [];
 	if(!title){
 		errors.push({text: 'Please Write a Title'});
 	}
 	if(!description){
 		errors.push({text: 'Please Write a Description'});
 	}
 	if (errors.length >0) {  //si hay algun error le mostramos los campos que inserto mal
 		res.render('notes/new-note',{
 			errors, //mensajes de errores
 			title, //volver a poner el titulo que tenia cuando se causo el error
 			description //volver a poner la descripcion que tenia cuando se causo el error
 		});
 	} else {
 		const newNote = new Note({ title, description }); //creando nuevo dato a la DB
 		newNote.user = req.user.id;
 		await newNote.save(); //guardar los datos en la DB
 		req.flash('success_msg', 'Note Added Successfully');
 		res.redirect('/notes');
 	}

	
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes',{ notes });
  });

router.get('/notes/edit/:id', isAuthenticated, async (req,res) => {
	const note = await Note.findById(req.params.id);
	res.render('notes/edit-note',{note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, {title, description});
	req.flash('success_msg', 'Notes Updated Succesfully');
	res.redirect('/notes');	
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Notes Deleted Succesfully');
	res.redirect('/notes');
});

module.exports = router; 