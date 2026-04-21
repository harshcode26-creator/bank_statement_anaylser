function mergeAndDeduplicate(allFiles) {
  const mergedTransactions = [];
  const seenTransactions = new Set();

  for (const file of allFiles || []) {
    for (const transaction of file.transactions || []) {
      const key = `${transaction.date}-${transaction.amount}-${transaction.description}`;

      if (!seenTransactions.has(key)) {
        seenTransactions.add(key);
        mergedTransactions.push(transaction);
      }
    }
  }

  return mergedTransactions;
}

module.exports = {
  mergeAndDeduplicate,
};
