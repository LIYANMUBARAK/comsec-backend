const mongoose = require("mongoose");

const companySecretarySchema = new mongoose.Schema({
  tcspLicenseNo: { type: String, required: true },
  tcspReason: { type: String },
  type: { type: String, required: true }, 
  surname: { type: String },
  name: { type: String, required: true },
  chineeseName: { type: String },
  NNC1Singed: { type: Boolean,default:false },
  NNC1From: { type: String },
  idProof: { type: String},
  address: { type: String, required: true },
  district: { type: String},
  building: { type: String },
  street: { type: String },
  addressProof: { type: String},
  email: { type: String, required: true, unique: true }, 
  phone: { type: String },
  countryCode: { type: String, default: "+91" },
  idNo: {type: String},
  companyNo : {type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Companyaccount" } 
}, { timestamps: true });

module.exports = mongoose.model("CompanySecretary", companySecretarySchema);
