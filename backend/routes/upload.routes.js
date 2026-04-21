const express = require("express");
const upload = require("../middleware/upload.middleware");
const { uploadFiles } = require("../controllers/upload.controller");

const router = express.Router();

router.post("/", upload.array("files", 10), uploadFiles);

module.exports = router;
