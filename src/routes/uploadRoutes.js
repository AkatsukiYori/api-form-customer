const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { authenticateAPIKey } = require("../middlewares");

function getCategoryDirectory(category) {
  const baseDir = "Files";
  switch (category) {
    case "FileIDCompanyOrPersonal":
      return path.join(baseDir, "FileIDCompanyOrPersonal");
    case "FileIDPersonCharge":
      return path.join(baseDir, "FileIDPersonCharge");
    case "FileSPPKPCompany":
      return path.join(baseDir, "FileSPPKPCompany");
    case "FilePDFCustomer":
      return path.join(baseDir, "FilePDFCustomer");
    case "FileIDSignature":
      return path.join(baseDir, "FileIDSignature");
    case "FileIDMergingPdf":
      return path.join(baseDir, "FileIDMergingPdf");
    default:
      throw new Error("Invalid category specified.");
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const targetDir = getCategoryDirectory(req.body.category);
      fs.mkdirSync(targetDir, { recursive: true });
      cb(null, targetDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Ambil nama file dari request body atau gunakan nama asli jika tidak ada
    const filename = req.body.filename || file.originalname;
    cb(null, filename + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpg|jpeg|pdf|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpg and .pdf files are allowed!"));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post(
  "/uploadfile",
  authenticateAPIKey,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        // Tangani error dari Multer dan kembalikan JSON
        return res.status(400).json({
          status: false,
          msg: err.message || "Upload error",
        });
      }
      next();
    });
  },
  controller.upload
);
router.get("/checkfile", authenticateAPIKey, controller.checkfile);

router.get("/getfile/:category/:filename", authenticateAPIKey, (req, res) => {
  const { category, filename } = req.params;
  const filePath = path.join(
    __dirname,
    "../../Files/",
    category,
    "/",
    filename
  );
  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: false,
      msg: "File tidak ditemukan",
    });
  }
  // console.log(filePath);
  // Kirim file ke client (bisa untuk preview atau download)
  res.sendFile(filePath);
});

router.delete(
  "/deletefile/:category/:filename",
  authenticateAPIKey,
  (req, res) => {
    try {
      const { filename, category } = req.params; // Ganti dari req.body ke req.query
      console.log(filename, category);
      if (!filename || !category) {
        return res.status(400).json({
          status: false,
          msg: "Filename dan category diperlukan",
        });
      }

      const filePath = path.join(
        __dirname,
        "../../Files/",
        category,
        "/",
        filename
      );

      // Periksa apakah file ada
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          status: false,
          msg: "File tidak ditemukan",
        });
      }

      // Hapus file
      fs.unlinkSync(filePath);

      return res.status(200).json({
        status: true,
        msg: "File berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: error.message,
      });
    }
  }
);

module.exports = router;
