const express = require("express"); //objeto que me facilitara la creacion de rutas
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const Image = require("../models/Image");
const Text = require("../models/Text");

const passport = require("passport");
const { adminAuthenticated } = require("../helpers/authAdmin");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/img/uploads"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
   
    if (mimetype && extname) {
      return cb(null, true);
    }
    req.fileValidationError = "goes wrong on the mimetype";
    return cb(
      null,
      false,
      new Error("Error: El archivo tiene que ser una imagen")
    );
  },
}).single("image");

router.get("/upload/signin", async (req, res) => {
  const image = await Image.find();
  res.render("admin/Signin",{image});
});

router.post(
  "/upload/signin",
  passport.authenticate("login", {
    successRedirect: "/upload",
    failureRedirect: "/admin/signin",
    failureFlash: true,
  })
);

router.get("/upload", adminAuthenticated, async (req, res) => {
  const image = await Image.find();
  const text = await Text.find();
  res.render("admin", { image, text });
  //ruta para mostrar la imagen ya cargada
});

router.get("/upload/edit/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);
  res.render("admin/upload", { image });
});
router.put(
  "/upload/edit-img/:id",
  upload,
  function (req, res, next) {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        req.flash(
          "error",
          "Error: El archivo tiene que ser una Imagen y debe pesar maximo 1 MB"
        );
        res.redirect("/upload");
      } else {
        next();
      }

      //return res.end(req.fileValidationError);
    });
  },
  async (req, res) => {
    const { title, description } = req.body;

    const path = "/img/uploads/" + req.file.filename;
    await Image.findByIdAndUpdate(req.params.id, { title, description, path });
    req.flash("success_msg", "Image Updated Succesfully");
    res.redirect("/");
  }
);

router.get("/", async (req, res) => {
  const image = await Image.find();
  const text = await Text.find();
  res.render("index", { image, text });
  //ruta para mostrar la imagen ya cargada
});

router.get("/img", (req, res) => {
 
  res.render("admin/img");
});

router.post("/img", upload, async (req, res) => {
  const image = new Image();
  image.title = req.body.title;
  image.description = req.body.description;
  image.filename = req.file.filename;
  image.path = "/img/uploads/" + req.file.filename;
  image.originalname = req.file.originalname;
  image.mimetype = req.file.mimetype;
  image.size = req.file.size;

  await image.save();
  //await fs.unlink(req.file.path);
  res.redirect("/");

  //ruta para guardar la imagen
});

router.get("/upload/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
