const { QuoteModel } = require("../models/quote");

const insertQuotes = async (req, res) => {
  try {
    // const promises = [];

    // for (let index = 0; index < 200; index++) {
    //   promises.push(
    //     QuoteModel.create({
    //       quote: `quote: ${index + 1}`,
    //       author: `author: ${index + 1}`,
    //     })
    //   );
    // }

    // await Promise.all(promises);

    for (let index = 0; index < 200; index++) {
      await QuoteModel.create({
        quote: `quote: ${index + 1}`,
        author: `author: ${index + 1}`,
      });
    }

    return res.status(200).json({ message: "Quotes Inserted Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteAllQuotes = async (req, res) => {
  try {
    await QuoteModel.deleteMany({});

    return res
      .status(200)
      .json({ message: "All Quotes Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { insertQuotes, deleteAllQuotes };
