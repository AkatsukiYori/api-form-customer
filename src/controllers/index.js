const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
module.exports = {
  async checkstatus(req, res) {
    try {
      return res.status(200).json({
        status: true,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: error.message,
      });
    }
  },
  async upload(req, res) {
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).send({
          success: false,
          message: "Category are required.",
        });
      }
      if (!req.file || req.file.length === 0) {
        return res.status(400).json({
          status: false,
          msg: "No file uploaded.",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "File uploaded successfully",
        files: req.files,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: error.message,
      });
    }
  },

  async checkfile(req, res) {
    try {
      const { filename, category } = req.query;
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

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          status: false,
          msg: "File not found",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "File found",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: error.message,
      });
    }
  },
};
