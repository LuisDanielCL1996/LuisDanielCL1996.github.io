const mongoose = require ('mongoose');
const { Schema } = mongoose; //creando un schema de datos para poder utilizarlo

const textSchema = new Schema({ //le decimos a mongodb como van a lucir los datos
	title: {type: String, required: true},
	description: {type: String, required: true},
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Text',textSchema) 
//se declara como se llamara el schema para poder utilizarlo en otras partes de la aplicacion

