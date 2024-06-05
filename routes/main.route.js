const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");

// middleware imports
const { custom404 } = require("../middlewares/custom-404");
const { credentials } = require("../middlewares/credentials");

// configuration imports
const { corsOptions } = require("../config/allowed-origins");

// graphql imports
const { graphqlConfiguration } = require("../graphql/configuration");

// controllers imports
const { viewHTML } = require("../controllers/view.controllers");

// routers imports
const { quotesRouter } = require("./routes/quote.route");

// constants
const mainRouter = express.Router();
const endpointsRouter = express.Router();

// public route
mainRouter.use(express.static(path.resolve(__dirname, "./../public")));

// middlewares usage
mainRouter.use(credentials);
mainRouter.use(cors(corsOptions));
mainRouter.use(express.urlencoded({ extended: false }));
mainRouter.use(express.json());
mainRouter.use(cookieParser());

// main routes
mainRouter.route("/").get(viewHTML);
mainRouter.use("/api", endpointsRouter);

// endpoints routes
endpointsRouter.use("/quotes", quotesRouter);
endpointsRouter.use("/graphql", graphqlConfiguration);

// fallback route
mainRouter.all("*", custom404);

module.exports = { mainRouter };
