const express = require("express"); //objeto que me facilitara la creacion de rutas
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Image = require("../models/Image");
const fs = require("fs-extra");

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

router.get("/upload", async (req, res) => {
  const image = await Image.find();
  res.render("admin", { image });
  //ruta para mostrar la imagen ya cargada
});

router.get("/upload/edit/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);
  res.render("admin/upload", { image });
});
router.put(
  "/upload/edit-img/:id",
  function (req, res) {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        req.flash("error", "Error: El archivo tiene que ser una Imagen");
        res.redirect("/upload");
        
      }
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

  res.render("index", { image });
  //ruta para mostrar la imagen ya cargada
});

router.post("/upload", async (req, res) => {
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

router.get("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const image = await image.findById(id);

  //ruta para elegir la imagen que sera remplazada
});

router.get("/admin/:id/upload", (req, res) => {
  res.send("Image Upload");
  //ruta para mostrar la imagen ya cargada
});

module.exports = router;
