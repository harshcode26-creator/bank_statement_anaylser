const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload",
  },

  date: String,
  description: String,
  amount: Number,
  type: String,
  category: String,
});

module.exports = mongoose.model("Transaction", transactionSchema);
