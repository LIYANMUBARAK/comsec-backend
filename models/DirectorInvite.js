const mongoose = require("mongoose");

const directorInviteSchema = new mongoose.Schema({
  name: { type: String, required: true },
   email: { type: String, required: true}, 
   roles: { type: String, required: true}, 
   password: { type: String, required: true },
   classOfShares: { type: String}, 
   noOfShares: { type: Number }, 
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Companyaccount', required: true }, 
 }, { timestamps: true });

module.exports = mongoose.model("DirectorInvite", directorInviteSchema);
