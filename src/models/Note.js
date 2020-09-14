const mongoose = require ('mongoose');
const { Schema } = mongoose; //creando un schema de datos para poder utilizarlo

const NoteSchema = new Schema({ //le decimos a mongodb como van a lucir los datos
	title: {type: String, required: true},
	description: {type: String, required: true},
	date: { type: Date, default: Date.now },
	user: {type: String}
});

module.exports = mongoose.model('Note',NoteSchema) 
//se declara como se llamara el schema para poder utilizarlo en otras partes de la aplicacion

