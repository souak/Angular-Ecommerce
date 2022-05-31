const express = require("express");
const app = express();
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

const productsRoutes = require("./routers/products");
const ordersRoutes = require("./routers/orders");
const usersRoutes = require("./routers/users");
const categoriesRoutes = require("./routers/categories");

const cors = require("cors");
const api_version = process.env.URL_VERSION;

app.use(cors());
app.options("*", cors());

//middleware

app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes

app.use(`${api_version}/products`, productsRoutes);
app.use(`${api_version}/orders`, ordersRoutes);
app.use(`${api_version}/users`, usersRoutes);
app.use(`${api_version}/categories`, categoriesRoutes);

//contect app to mongodb

mongoose
  .connect(process.env.URI_STRING)
  .then(() => {
    console.log("database connection is ready!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("it's listening on port 3000");
});
