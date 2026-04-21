function getCategory(description) {
  const text = String(description || "").toLowerCase();
  const hasKeyword = (keywords) => keywords.some((keyword) => text.includes(keyword));

  if (hasKeyword([
    "grocery",
    "mart",
    "store",
    "dairy",
    "restaurant",
    "zomato",
    "swiggy",
    "cafe",
    "hotel",
  ])) {
    return "Food";
  }

  if (hasKeyword([
    "uber",
    "ola",
    "taxi",
    "flight",
    "train",
    "fuel",
    "petrol",
  ])) {
    return "Travel";
  }

  if (hasKeyword([
    "amazon",
    "flipkart",
    "mall",
    "shopping",
    "purchase",
  ])) {
    return "Shopping";
  }

  if (hasKeyword([
    "electricity",
    "bill",
    "recharge",
    "broadband",
    "water",
  ])) {
    return "Bills";
  }

  if (hasKeyword([
    "movie",
    "cinema",
    "netflix",
    "subscription",
    "ticket",
  ])) {
    return "Entertainment";
  }

  return "Other";
}

module.exports = { getCategory };
