const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(cors());

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
