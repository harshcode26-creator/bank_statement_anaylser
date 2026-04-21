function normalizeLine(line) {
  return String(line || "").replace(/\s+/g, " ").trim();
}

function cleanText(text) {
  return String(text || "")
    .split("\n")
    .map(normalizeLine)
    .filter(Boolean);
}

function cleanCSV(rows) {
  return (rows || [])
    .map((row) => Object.values(row || {}).join(" "))
    .map(normalizeLine)
    .filter(Boolean);
}

module.exports = {
  cleanText,
  cleanCSV,
};
