const express = require("express");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const { fromDomain } = require("./src/middlewares");
const app = express();
const port = process.env.PORT || 5000;
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 menit
  max: 100, // batas maksimum setiap IP untuk mengakses API dalam windowMs
  message: "Too many request",
});

app.use(apiLimiter);
app.use(fromDomain);

// Route uploadfile (khusus, tanpa bodyParser)
const uploadRoutes = require("./src/routes/uploadRoutes");
app.use("/api", uploadRoutes);

// Route lain (pakai bodyParser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const appRoute = require("./src/routes");
app.use("/api", appRoute);

app.listen(port, () => {
  console.log(`Server Berjalan di Port : ${port}`);
});
