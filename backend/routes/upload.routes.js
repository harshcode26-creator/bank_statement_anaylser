const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
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

router.post("/", authMiddleware, upload.array("files", 10), uploadFiles);
router.get("/", authMiddleware, getAllUploads);
router.get("/:id/transactions", authMiddleware, getTransactions);
router.patch("/:id", authMiddleware, updateUpload);
router.delete("/:id", authMiddleware, deleteUpload);
router.get("/:id", authMiddleware, getUploadById);

module.exports = router;
