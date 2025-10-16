// models/InviteShareholder.js
const mongoose = require('mongoose');

const InviteShareholderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  roles: { type: String, required: true}, 
  shareDetails:[
      {
        shareDetailsNoOfShares: {
          type: Number,
        },
        shareDetailsClassOfShares: {
          type: String,
        },
      }
    ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Companyaccount', required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('InviteShareholder', InviteShareholderSchema);
