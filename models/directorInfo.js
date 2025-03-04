  const mongoose = require("mongoose");

  const directorSchema = new mongoose.Schema(
    {
      surname: { type: String },
      name: { type: String, required: true },
      chineeseName: { type: String },
      NNC1Singed: { type: Boolean,default:false },
      NNC1From: { type: String },
      idNo: {
      type: String
    },
      idProof: { type: String, required: true },
      type: { type: String, required: true },
      address: { type: String, required: true },
      street: { type: String },
      building: { type: String },
      isInvited: {
        type: Boolean,
        Default:false
      },
      district: { type: String},
      addressProof: { type: String },
      email: { type: String, required: true,unique:true},
      phone: { type: String},
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyAccount", required: true },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Director", directorSchema);
