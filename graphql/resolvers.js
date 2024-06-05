const { QuoteModel } = require("../models/quote");

const graphqlResolver = {
  quotes: async function () {
    const quotes = await QuoteModel.find();
    return {
      quotes: quotes.map((q) => {
        return {
          ...q._doc,
          _id: q._id.toString(),
        };
      }),
    };
  },
  createQuote: async function ({ quoteInput }) {
    const quote = await QuoteModel.create({
      quote: quoteInput.quote,
      author: quoteInput.author,
    });
    return quote.toObject();
  },
  updateQuote: async function ({ id, quoteInput }) {
    const quote = await QuoteModel.findOneAndUpdate({ _id: id }, quoteInput, {
      new: true,
      runValidators: true,
    });
    if (!quote) {
      throw new Error("No quote found!");
    }

    return quote.toObject();
  },
  deleteQuote: async function ({ id }) {
    const quote = await QuoteModel.findOneAndDelete({ _id: id });
    if (!quote) {
      throw new Error("No quote found!");
    }

    return quote.toObject();
  },
};

module.exports = { graphqlResolver };
