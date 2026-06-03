const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    customerId: { type: Number, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Account", accountSchema);
