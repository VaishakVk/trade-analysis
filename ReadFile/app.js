require("dotenv").config();
const express = require("express");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
const bodyParser = require("body-parser");

// CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Methods",
		"GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
	);
	res.header("Access-Control-Expose-Headers", "Content-Length");
	res.header(
		"Access-Control-Allow-Headers",
		"Accept, Authorization, Content-Type, X-Requested-With, Range"
	);
	if (req.method === "OPTIONS") {
		return res.send(200);
	} else {
		return next();
	}
});

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/file", fileRoutes);

app.use((err, req, res, next) => {
	return res
		.status(err.status || 500)
		.send({ status: false, response: err.message || err });
});

module.exports = app;
