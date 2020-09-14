const express = require('express');
const path = require('path');	
const exphbs = require('express-handlebars'); //el motor de plantillas
const methodOverride = require('method-override'); 
const session = require('express-session'); 
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'); 
const flash = require('connect-flash');
const passport = require('passport');


// Initialiazations
const app = express();
require('./database');
require('./config/passport');
// Settings    (aqui van todas las configuraciones, Sherlock)
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views')); //el metodo join me permite unir directorios (le dice a node donde esta la carpeta views)
app.engine('.hbs',exphbs({  //se le declara un objeto de configuracion en "exphbs"
	 handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayaout: 'main',   //todas estas configuraciones hacen una vista por default en todas las vistas
	layoutsDir: path.join(app.get('views'),'layouts'),
	partialDir: path.join(app.get('views'),'partials'),
	extname:'.hbs'
}));
app.set('view engine','.hbs');

// Middlewares (todas las funciones que seran ejecutadas antes de llegar al servidor)
app.use(express.urlencoded({extended: false})); //sirve para poder entender los datos entregados del formulario
app.use(methodOverride('_method')); 
app.use(session({
	secret: 'mysecretapp',
	resave: true,      //configuraciones por defecto para express que nos permitira
	saveUninitialized: true //autenticar al usuario y almacenar esos datos temporalmente 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Global variables 
app.use((req, res, next) =>{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next(); 
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname,'public')));

// Server init
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
});