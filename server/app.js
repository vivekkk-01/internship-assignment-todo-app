const express = require("express");
const mongoose = require("mongoose");
require("dotenv-safe").config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://internship-assignment-todo-jvtfb0n3a-viveks-projects-281df315.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");

app.use("/api/sessions", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.log(`Error: ${err}`));

module.exports = app;
