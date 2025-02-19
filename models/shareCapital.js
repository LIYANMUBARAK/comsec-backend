const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shareCapitalSchema = new Schema({
  companyid: { type: Schema.Types.ObjectId, required: true, ref: "Companyaccount" },
  userid: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  total_share: { type: Number, required: true },
  amount_share: { type: Number, required: true },
  total_capital_subscribed: { type: Number, required: true },
  unpaid_amount: { type: Number, required: true },
  share_class: { type: String, required: true },
  share_right: { type: String, required: true },
});

const ShareCapital = mongoose.model("ShareCapital", shareCapitalSchema);
module.exports = ShareCapital;
