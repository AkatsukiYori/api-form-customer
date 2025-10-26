const allowedOrigins = [
  "htps://form-customer.papasari.com", // Tanpa trailing slash
  "http://localhost",
  "http://192.168.2.63"
];

module.exports = function (req, res, next) {
  const origin = req.headers.origin;

  // Jika tidak ada Origin (misalnya dari Laravel), tetap izinkan
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  } else {
    return res.status(403).json({
      status: false,
      msg: "Access from this domain is not allowed",
    });
  }
};
