const path = require("path");
const { extractFile } = require("../services/extractor.service");
const { cleanText, cleanCSV } = require("../services/cleaner.service");
const { detectTransactionLines } = require("../services/detector.service");
const { parseTransactions } = require("../services/parser.service");
const { mergeAndDeduplicate } = require("../services/deduplicate.service");
const { calculateAnalytics } = require("../services/analytics.service");
const { getCategory } = require("../services/category.service");
const { categorizeWithAI } = require("../services/aiCategorizer.service");

const buildPreview = (transactions) => transactions.slice(0, 10);

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
            category: getCategory(transaction.description),
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

    res.json({
      message: "Analysis complete",
      totalTransactions: categorizedTransactions.length,
      summary: analytics.summary,
      categories: analytics.categories,
      monthly: analytics.monthly,
      preview: buildPreview(categorizedTransactions),
      transactions: categorizedTransactions,
    });
  } catch (error) {
    console.error("Transaction parsing failed:", error);
    res.status(500).json({
      message: "Failed to parse transactions",
    });
  }
};

module.exports = {
  uploadFiles,
};
