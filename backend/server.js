require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const recipeRoutes = require("./routes/recipes");

// express app
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

// middleware
app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/recipes", recipeRoutes);

// connect to db
const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(port, () => {
      console.log(`listening for requests on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
