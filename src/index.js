const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars"); //el motor de plantillas
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const session = require("express-session");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const flash = require("connect-flash");
const passport = require("passport");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
AdminBro.registerAdapter(require("@admin-bro/mongoose"));

// Initialiazations
const app = express();

const Note = require("./models/Note");
const User = require("./models/User");
//const Image = require('./models/Image');
//const Admin = require('./models/admin');
// Resources definitions
const Admin = mongoose.model("Admin", {
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ["admin", "restricted"], required: true },
});

const adminBro = new AdminBro({
  resources: [
    {
      resource: Admin,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: "string",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
    { resource: User },
    { resource: Note },
  ],
  rootPath: "/admin",
});
const routerUser = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const admin = await Admin.findOne({ email });
    if (admin) {
      const matched = await bcrypt.compare(password, admin.encryptedPassword);
      if (matched) {
        return admin;
      }
    }
    return false;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
});
app.use(adminBro.options.rootPath, routerUser);

require("./database");
require("./config/passport");
//require('./config/AdminBro');

// Settings    (aqui van todas las configuraciones, Sherlock)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
//el metodo join me permite unir directorios (le dice a node donde esta la carpeta views)
//devuelve la ruta de donde se esta ejecutando determinado archivo
const hbs = exphbs.create({
  //se le declara un objeto de configuracion en "exphbs"
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayaout: "main",
  //todas estas configuraciones hacen una vista por default en todas las vistas
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialDir: path.join(app.get("views"), "partials"),
  extname: ".hbs",
  // create custom helpers here
  helpers: {
    imageZero: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 0) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageOne: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 1) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageTwo: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 2) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageThree: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 3) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageFour: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 4) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageFive: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 5) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageSix: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 6) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageSeven: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 7) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageEight: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 8) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageNine: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 9) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
    imageTen: function (value, options) {
      let out = "";
      for (let i = 0; i < value.length; i++) {
        if (i == 10) {
          out = out + options.fn(value[i]);
        }
      }
      return out;
    },
  },
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middlewares (todas las funciones que seran ejecutadas antes de llegar al servidor)
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
app.use(
  multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname));
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb("Error: Archivo debe ser una imagen valida");
    },
  }).single("image")
);
//sirve para poder entender los datos entregados del formulario
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "mysecretapp",
    resave: true, //configuraciones por defecto para express que nos permitira
    saveUninitialized: true, //autenticar al usuario y almacenar esos datos temporalmente
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));
app.use(require("./routes/admin-upload"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Server init
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
