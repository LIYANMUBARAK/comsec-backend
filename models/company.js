const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    business_name: { type: String, required: true },
    trading_name: { type: String },
    business_name_chinese: { type: String },
    type_of_business: { type: String },
    natureOfBusiness: { type: String },
    natureOfBusiness_code: { type: Number },
    subscriptionDuration: { type: String },
    office_address: { type: String },
    office_address1: { type: String },
    office_city: { type: String },
    office_country: { type: String },
    office_state: { type: String },
    email_id: { type: String },
    mobile_number: { type: String },
    fax: { type: String },
    reference_no: { type: String },
    company_logo: { type: Object },
    presentorName: { type: String }, 
    presentorDistrict: { type: String }, 
    presentorStreet: { type: String }, 
    presentorBuilding: { type: String }, 
    presentorChiName: { type: String }, 
    presentorAddress: { type: String }, 
    presentorTel: { type: String }, 
    presentorFax: { type: String }, 
    presentorEmail: { type: String }, 
    total_share: { type: Number },
    amount_share: { type: Number },
    company_number: { type: String },
    br_number: { type: String },
    incorporate_date: { type: Date, default: Date.now },
    financial_date: { type: Date },
    country: { type: String },
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    active: { type: String, default: "0" },
    startDate: { type: Date, default: Date.now },
    dueEndDate: { type: Date },
    share_class: { type: Object },  
    share_right: { type: String },
    directors: [{ type: Schema.Types.ObjectId, ref: "Director" }],
    shareholders: [{ type: Schema.Types.ObjectId, ref: "ShareholderInfo" }],
    secretary: { type: Schema.Types.ObjectId, ref: "CompanySecretary" },
    ncc1Forms: [{ type: String }], // Store uploaded NCC1 form URLs or file paths
    proceededBy: { type: String }, // Name of the secretary proceeding the application
    status: { type: String, default: "inprocessing" }, // Status field
    project: { type: String, default: "incorporation" }, // Project type
    publishedDocuments: { type: Number, default: 0 }, // Count of uploaded NCC1 documents
  },
  { timestamps: true }
);

const CompanyAccount = mongoose.model("CompanyAccount", companySchema);
module.exports = { CompanyAccount };

