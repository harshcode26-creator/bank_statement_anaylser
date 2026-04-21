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
  console.log("Transactions received:", (transactions || []).length);
  
  let income = 0;
  let expense = 0;
  const categories = { ...DEFAULT_CATEGORIES };
  const monthly = {};
  const merchantMap = {};

  for (const transaction of transactions || []) {
    const amount = Number(transaction.amount) || 0;
    const category = normalizeCategory(transaction.category);
    const monthKey = getMonthKey(transaction.date);

    if (transaction.type === "credit") {
      income += amount;
    } else if (transaction.type === "debit") {
      expense += amount;
      categories[category] += amount;

      // Top Merchants logic (EXACT)
      if (transaction.description) {
        const key = transaction.description.trim();
        merchantMap[key] = (merchantMap[key] || 0) + amount;
      }
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

  // Finalize Top Merchants (EXACT)
  const topMerchants = Object.entries(merchantMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  console.log("Top Merchants:", topMerchants);

  // Insights logic (SIMPLE)
  const totalExpense = expense;
  
  let topCategory = "Other";
  const categoryKeys = Object.keys(categories);
  if (categoryKeys.length > 0) {
    topCategory = categoryKeys.reduce((a, b) =>
      categories[a] > categories[b] ? a : b
    );
  }

  const foodAmount = categories["Food"] || 0;
  const foodPercentage = totalExpense
    ? ((foodAmount / totalExpense) * 100).toFixed(1)
    : 0;

  const maxTransaction = (transactions || [])
    .filter(t => t.type === "debit")
    .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

  const insights = [
    `You spent the most on ${topCategory}`,
    `Food accounts for ${foodPercentage}% of your total expenses`,
    maxTransaction
      ? `Your highest expense was \u20B9${Number(maxTransaction.amount).toLocaleString("en-IN")} at ${maxTransaction.description}`
      : "No transactions found"
  ];

  console.log("Insights:", insights);

  return {
    summary: {
      income,
      expense,
      net: income - expense,
    },
    categories,
    monthly,
    topMerchants,
    insights,
  };
}

module.exports = {
  calculateAnalytics,
};
