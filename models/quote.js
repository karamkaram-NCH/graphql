const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const QuoteModel = mongoose.model("Quote", quoteSchema);

module.exports = { QuoteModel };
