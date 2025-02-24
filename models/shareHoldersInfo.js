const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shareholdersInfoSchema = new Schema(
  {
    surname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    chineeseName: {
      type: String,
    },
    idNo: {
      type: String,
      required: true,
    },
    NNC1Singed: { type: Boolean,default:false },
    NNC1From: { type: String },
    idProof: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['person', 'company'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    addressProof: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    shareDetailsNoOfShares: {
      type: Number,
      required: true,
    },
    shareDetailsClassOfShares: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Companyaccount', 
      required: true,
    },
  },
  { timestamps: true }
);

const ShareholderInfo = mongoose.model("ShareholderInfo", shareholdersInfoSchema);

module.exports = { ShareholderInfo };
