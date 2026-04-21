const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const csvParser = require("csv-parser");

async function extractPDF(filePath) {
  const fileBuffer = await fs.promises.readFile(filePath);

  if (typeof pdfParse === "function") {
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text;
  }

  if (typeof pdfParse.PDFParse === "function") {
    const parser = new pdfParse.PDFParse({ data: fileBuffer });

    try {
      const parsedPdf = await parser.getText();
      return parsedPdf.text;
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported pdf-parse export shape");
}

function extractCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", reject);
    fileStream
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function extractFile(file) {
  const extension = path.extname(file.originalname || file.filename).toLowerCase();
  const filePath = file.path || path.join(__dirname, "..", "uploads", file.filename);

  if (extension === ".pdf") {
    return extractPDF(filePath);
  }

  if (extension === ".csv") {
    return extractCSV(filePath);
  }

  throw new Error(`Unsupported file type: ${extension || "unknown"}`);
}

module.exports = {
  extractPDF,
  extractCSV,
  extractFile,
};
