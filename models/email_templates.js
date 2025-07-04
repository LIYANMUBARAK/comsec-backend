const mongoose = require('mongoose');

const userInviteEmailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "user_invitation"
  subject: { type: String, required: true },
  html: { type: String, required: true }, // HTML content with placeholders
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  'EmailTemplate', // ✅ THIS is the model name
  userInviteEmailTemplateSchema,
  'email_templates' // ✅ force correct collection name
);