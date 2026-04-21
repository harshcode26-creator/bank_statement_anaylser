const dateRegex = /\b\d{1,4}[-/]\d{1,2}[-/]\d{1,4}\b/;
const amountRegex =
  /(?<![\d/:\-.])[-+]?(?:(?:\d{1,3}(?:,\d{3})+|\d{3,})(?:\.\d{2})?|\d+\.\d{2})(?![\d/:\-])/;
const excludedTransactionPhrases = ["opening balance", "closing balance", "balance forward"];

function detectTransactionLines(lines) {
  const transactions = [];

  for (const line of lines || []) {
    const normalizedLine = String(line || "").toLowerCase();
    const hasDate = dateRegex.test(line);
    const hasAmount = amountRegex.test(line);
    const isExcluded = excludedTransactionPhrases.some((phrase) => normalizedLine.includes(phrase));

    if (hasDate && hasAmount && !isExcluded) {
      transactions.push(line);
    }
  }

  return transactions;
}

module.exports = {
  dateRegex,
  amountRegex,
  detectTransactionLines,
};
