const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/proyect-db-app',{
	useCreateIndex: true,
	useNewUrlParser:true, //configuraciones basicas de conexion para no tener errores
	useFindAndModify: false  //Al momento de manipular la DB
})
.then(db => console.log('DB is connected')) // cuando ya te conectes muestra que lo hiciste
.catch(err => console.error(err));