const DEFAULT_CATEGORIES = {
  Food: 0,
  Travel: 0,
  Shopping: 0,
  Bills: 0,
  Entertainment: 0,
  Other: 0,
};

function getMonthKey(date) {
  const value = String(date || "").trim();

  if (!value) {
    return "Unknown";
  }

  const separator = value.includes("/") ? "/" : "-";
  const parts = value.split(separator);

  if (parts.length !== 3) {
    return value;
  }

  if (parts[0].length === 4) {
    return `${parts[0]}-${String(parts[1]).padStart(2, "0")}`;
  }

  return `${parts[2]}-${String(parts[1]).padStart(2, "0")}`;
}

function calculateAnalytics(transactions) {
  let income = 0;
  let expense = 0;
  const categories = { ...DEFAULT_CATEGORIES };
  const monthly = {};

  for (const transaction of transactions || []) {
    const amount = Number(transaction.amount) || 0;
    const category = Object.prototype.hasOwnProperty.call(categories, transaction.category)
      ? transaction.category
      : "Other";
    const monthKey = getMonthKey(transaction.date);

    if (transaction.type === "credit") {
      income += amount;
    } else if (transaction.type === "debit") {
      expense += amount;
      categories[category] += amount;
    }

    if (!monthly[monthKey]) {
      monthly[monthKey] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.type === "credit") {
      monthly[monthKey].income += amount;
    } else if (transaction.type === "debit") {
      monthly[monthKey].expense += amount;
    }
  }

  return {
    summary: {
      income,
      expense,
      net: income - expense,
    },
    categories,
    monthly,
  };
}

module.exports = {
  calculateAnalytics,
};
