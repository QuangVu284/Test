const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authController = require("./controller/authController");
const authRoute = require("./routes/auth");

dotenv.config();
const app = express();
const port = 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoute);

app.get("/initialized", async (req, res) => {
  try {
    console.log("Initializing database...");
    await authController.initializeDB(req, res);
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).send("Error initializing database.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
