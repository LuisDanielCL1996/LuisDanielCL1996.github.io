const mongoose = require ('mongoose');
const { Schema } = mongoose; //creando un schema de datos para poder utilizarlo

const imageSchema = new Schema({ //le decimos a mongodb como van a lucir los datos
	title: {type: String, required: true},
	description: {type: String, required: true},
	filename: {type: String},
	path: {type: String},
	originalname: {type: String},
	mimetype: {type: String},
	size: {type: Number},
	created_at: { type: Date, default: Date.now }  
});

module.exports = mongoose.model('Image',imageSchema); 
//se declara como se llamara el schema para poder utilizarlo en otras partes de la aplicacion

