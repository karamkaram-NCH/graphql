const {
  insertQuotes,
  deleteAllQuotes,
} = require("../../controllers/quote.controllers");

const quotesRouter = require("express").Router();

quotesRouter.route("/").get(insertQuotes);

quotesRouter.route("/delete").get(deleteAllQuotes);

module.exports = { quotesRouter };
