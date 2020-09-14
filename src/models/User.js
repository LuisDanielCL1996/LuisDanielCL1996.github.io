const mongoose = require ('mongoose');
const { Schema } = mongoose; //creando un schema de datos para poder utilizarlo
const bcrypt = require('bcryptjs'); 

const UserSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	date: {type: Date, default: Date.now}
});

//este metodo nos permite cifrar la password
UserSchema.methods.encryptPassword =  async (password) => { 
	const salt = await bcrypt.genSalt(10); //se genera un Hash
	 //se aplica 10 veces el algoritmo de encriptacion (es lo comun 10)
	 const hash = bcrypt.hash(password,salt);
	 return hash;
};


//este metodo compara las password del login del usuario con la de la DB
UserSchema.methods.matchPassword =  async function (password){
	return  await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User',UserSchema);