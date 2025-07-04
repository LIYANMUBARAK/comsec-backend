const mongoose = require("mongoose");

const incorporationDocumentsSchema = new mongoose.Schema({
  srNo: {
    type: Number,
    required: true,
    unique: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  templateUrl: {
    type: String, // URL of PDF stored in Cloudinary
    required: false,
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model("IncorporationDocuments", incorporationDocumentsSchema,"incorporationDocuments");
