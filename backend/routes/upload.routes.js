const express = require("express");
const upload = require("../middleware/upload.middleware");
const {
  deleteUpload,
  getAllUploads,
  getTransactions,
  getUploadById,
  updateUpload,
  uploadFiles,
} = require("../controllers/upload.controller");

const router = express.Router();

router.post("/", upload.array("files", 10), uploadFiles);
router.get("/", getAllUploads);
router.get("/:id/transactions", getTransactions);
router.patch("/:id", updateUpload);
router.delete("/:id", deleteUpload);
router.get("/:id", getUploadById);

module.exports = router;
