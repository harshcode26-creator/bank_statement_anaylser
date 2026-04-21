const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];
const DEFAULT_CATEGORIES = Object.fromEntries(
  CATEGORIES.map((category) => [category, 0]),
);

function normalizeCategory(category) {
  const value = String(category || "").trim();

  if (!value) {
    return "Other";
  }

  const normalized =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  return CATEGORIES.includes(normalized) ? normalized : "Other";
}

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
    const category = normalizeCategory(transaction.category);
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
