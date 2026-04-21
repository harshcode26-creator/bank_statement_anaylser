const { dateRegex, amountRegex } = require("./detector.service");

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseAmountValue(value) {
  return Number.parseFloat(String(value).replace(/,/g, ""));
}

function getNumericMatches(line) {
  const globalAmountRegex = new RegExp(amountRegex.source, "g");

  return [...String(line || "").matchAll(globalAmountRegex)]
    .map((match) => ({
      raw: match[0],
      index: match.index,
      value: parseAmountValue(match[0]),
    }))
    .filter((match) => !Number.isNaN(match.value));
}

function isAmountToken(token) {
  return /^[-+]?(?:\d+(?:,\d{3})*|\d+)(?:\.\d+)?$/.test(token);
}

function hasTypeMarker(line) {
  return /\b(?:CR|CREDIT|DR|DEBIT)\b/i.test(line);
}

function stripDateAndTypeMarkers(line, date) {
  let sanitizedLine = String(line || "");

  if (date) {
    sanitizedLine = sanitizedLine.replace(new RegExp(escapeRegex(date), "g"), " ");
  }

  return sanitizedLine.replace(/\b(?:CR|DR|CREDIT|DEBIT)\b/gi, " ");
}

function getStructuredCsvFields(line, date) {
  const sanitizedLine = stripDateAndTypeMarkers(line, date).trim();
  const tokens = sanitizedLine.split(/\s+/).filter(Boolean);
  const trailingNumericTokens = [];

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (!isAmountToken(tokens[index])) {
      break;
    }

    trailingNumericTokens.unshift(tokens[index]);
  }

  if (trailingNumericTokens.length < 3) {
    return null;
  }

  const numericColumns = trailingNumericTokens.slice(-3).map(parseAmountValue);
  const [debit, credit, balance] = numericColumns;
  const descriptionTokens = tokens.slice(0, tokens.length - trailingNumericTokens.length);

  return {
    debit,
    credit,
    balance,
    descriptionBase: descriptionTokens.join(" "),
  };
}

function chooseAmountMatch(line) {
  const numericMatches = getNumericMatches(line);

  if (!numericMatches.length) {
    return null;
  }

  if (numericMatches.length >= 3) {
    const debitCreditCandidates = numericMatches.slice(-3, -1);
    const nonZeroCandidates = debitCreditCandidates.filter((match) => Math.abs(match.value) > 0);

    if (nonZeroCandidates.length === 1) {
      return nonZeroCandidates[0];
    }
  }

  if (hasTypeMarker(line) && numericMatches.length >= 2) {
    return numericMatches[numericMatches.length - 2];
  }

  return numericMatches[numericMatches.length - 1];
}

function extractDate(line) {
  const match = String(line || "").match(dateRegex);
  return match ? match[0] : null;
}

function extractAmount(line) {
  const amountMatch = chooseAmountMatch(line);
  return amountMatch ? amountMatch.value : null;
}

function detectType(line, amount) {
  if (/\b(?:CR|CREDIT)\b/i.test(line)) {
    return "credit";
  }

  if (/\b(?:DR|DEBIT)\b/i.test(line)) {
    return "debit";
  }

  const numericMatches = getNumericMatches(line);
  if (numericMatches.length >= 3) {
    const [debitAmount, creditAmount] = numericMatches.slice(-3, -1).map((match) => match.value);

    if (Math.abs(debitAmount) > 0 && Math.abs(creditAmount) === 0) {
      return "debit";
    }

    if (Math.abs(creditAmount) > 0 && Math.abs(debitAmount) === 0) {
      return "credit";
    }
  }

  const amountMatch = chooseAmountMatch(line);
  if (amountMatch && typeof amountMatch.index === "number") {
    const prefix = line.slice(0, amountMatch.index);
    const suffix = line.slice(amountMatch.index + amountMatch.raw.length);

    if (/^\s*-\s*$/.test(suffix)) {
      return "debit";
    }

    if (/-\s*$/.test(prefix)) {
      return "credit";
    }
  }

  return amount < 0 ? "debit" : "credit";
}

function stripMatchedSegments(text, matches) {
  let result = String(text || "");

  for (const match of [...matches].sort((a, b) => (b.index || 0) - (a.index || 0))) {
    if (typeof match.index !== "number") {
      continue;
    }

    result = result.slice(0, match.index) + " " + result.slice(match.index + match.raw.length);
  }

  return result;
}

function extractDescription(line, date) {
  let description = String(line || "");

  if (date) {
    description = description.replace(new RegExp(escapeRegex(date), "g"), " ");
  }

  description = stripMatchedSegments(description, getNumericMatches(description));
  description = description.replace(/^\s*\d+\b/g, " ");

  return description
    .replace(/\b(?:CR|DR|CREDIT|DEBIT)\b/gi, " ")
    .replace(/\b0(?:\.00)?\b/g, " ")
    .replace(/^[^\p{L}]+/gu, " ")
    .replace(/[|*_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[,;:.\-\s]+|[,;:.\-\s]+$/g, "")
    .trim();
}

function parseTransactionLine(line) {
  const date = extractDate(line);
  const structuredCsvFields = getStructuredCsvFields(line, date);

  if (structuredCsvFields) {
    const { debit, credit, descriptionBase } = structuredCsvFields;
    let amount = credit;
    let type = "credit";

    if (debit > 0) {
      amount = debit;
      type = "debit";
    } else if (credit > 0) {
      amount = credit;
      type = "credit";
    }

    const description = descriptionBase
      .replace(/\d+/g, " ")
      .replace(/[|*_]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[,;:.\-\s]+|[,;:.\-\s]+$/g, "")
      .trim();

    return {
      date,
      description,
      amount,
      type,
    };
  }

  const amount = extractAmount(line);
  const type = detectType(line, amount);
  const description = extractDescription(line, date, amount);

  return {
    date,
    description,
    amount,
    type,
  };
}

function parseTransactions(lines) {
  return (lines || []).map((line) => parseTransactionLine(line));
}

module.exports = {
  extractDate,
  extractAmount,
  detectType,
  extractDescription,
  parseTransactionLine,
  parseTransactions,
};
