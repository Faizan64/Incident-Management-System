const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ims");

const signalSchema = new mongoose.Schema({
  componentId: String,
  message: String,
  severity: String,
  workItemId: Number,   // ✅ IMPORTANT ADD
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Signal", signalSchema);
