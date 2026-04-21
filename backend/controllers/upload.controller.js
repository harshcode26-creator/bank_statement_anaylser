const path = require("path");
const Upload = require("../models/Upload");
const Transaction = require("../models/Transaction");
const { extractFile } = require("../services/extractor.service");
const { cleanText, cleanCSV } = require("../services/cleaner.service");
const { detectTransactionLines } = require("../services/detector.service");
const { parseTransactions } = require("../services/parser.service");
const { mergeAndDeduplicate } = require("../services/deduplicate.service");
const { calculateAnalytics } = require("../services/analytics.service");
const { getCategory } = require("../services/category.service");
const {
  categorizeWithAI,
  normalizeCategory,
} = require("../services/aiCategorizer.service");

const buildPreview = (transactions) => transactions.slice(0, 10);

const withoutUser = (upload) => {
  const uploadData = upload.toJSON();
  delete uploadData.user;
  return uploadData;
};

const uploadFiles = async (req, res) => {
  try {
    const uploadedFiles = req.files || [];
    const parsedFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        const data = await extractFile(file);
        const extension = path.extname(file.originalname || file.filename).toLowerCase();
        let lines;

        if (extension === ".pdf") {
          lines = cleanText(data);
        } else if (extension === ".csv") {
          lines = cleanCSV(data);
        } else {
          throw new Error(`Unsupported file type: ${extension || "unknown"}`);
        }

        const transactionLines = detectTransactionLines(lines);
        const ruleCategorizedTransactions = parseTransactions(transactionLines).map(
          (transaction) => ({
            ...transaction,
            category: normalizeCategory(getCategory(transaction.description)),
          })
        );
        const transactions = await categorizeWithAI(ruleCategorizedTransactions);

        return {
          fileName: file.filename,
          transactions,
        };
      })
    );

    console.log(
      "Parsed transactions for files:",
      parsedFiles.map((file) => file.fileName)
    );

    const categorizedTransactions = mergeAndDeduplicate(parsedFiles);
    const analytics = calculateAnalytics(categorizedTransactions);
    const transactions = categorizedTransactions;
    const totalTransactions = transactions.length;
    
    const {
      summary,
      categories,
      monthly,
      topMerchants,
      insights
    } = analytics;

    const uploadDoc = await Upload.create({
      user: req.user.id,
      title: "Uploaded Statement",
      totalTransactions,
      summary,
      categories,
      monthly,
      topMerchants,
      insights,
    });

    const transactionDocs = transactions.map((t) => ({
      uploadId: uploadDoc._id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
    }));

    await Transaction.insertMany(transactionDocs);

    return res.json({
      message: "Analysis complete",
      uploadId: uploadDoc._id,
      totalTransactions,
      summary,
      categories,
      monthly,
      topMerchants,
      insights,
      preview: buildPreview(transactions),
      transactions,
    });
  } catch (error) {
    console.error("Transaction parsing failed:", error);
    res.status(500).json({
      message: "Failed to parse transactions",
    });
  }
};

const getUploadById = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findById(id);

    if (!upload || !upload.user || upload.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    return res.json(withoutUser(upload));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.json(uploads.map(withoutUser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    const upload = await Upload.findById(id);

    if (!upload || !upload.user || upload.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const filter = { uploadId: id };

    if (category) {
      filter.category = category;
      filter.type = "debit";
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const upload = await Upload.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    );

    if (!upload) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    return res.json(withoutUser(upload));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findOneAndDelete({ _id: id, user: req.user.id });

    if (!upload) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Transaction.deleteMany({ uploadId: id });

    return res.json({ message: "Upload deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteUpload,
  getAllUploads,
  getTransactions,
  getUploadById,
  updateUpload,
  uploadFiles,
};
