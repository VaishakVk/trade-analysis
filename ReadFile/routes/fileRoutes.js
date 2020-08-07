const express = require("express");
const router = express.Router();
const fileLib = require("../lib/files");

router.get("/", fileLib.readFileLineByLine);

module.exports = router;
