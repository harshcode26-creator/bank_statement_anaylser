const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalTransactions: Number,

  summary: {
    income: Number,
    expense: Number,
    net: Number,
  },

  categories: {
    type: Map,
    of: Number,
  },

  monthly: {
    type: Map,
    of: {
      income: Number,
      expense: Number,
    },
  },
});

module.exports = mongoose.model("Upload", uploadSchema);
