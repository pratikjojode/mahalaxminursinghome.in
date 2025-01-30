const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectdb = require("./config/db.js");
const path = require("path");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(morgan("dev"));

// Disable caching for development
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// API Routes - Place these before the wildcard route
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/feedback", require("./routes/feedBackRoute"));
app.use("/uploads", express.static("uploads"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./client/build")));

// React app route - Wildcard route should be last
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

dotenv.config();
connectdb();
mongoose.connect(process.env.MONGO_URL);

// Root API Route for Testing
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`.bgYellow.black);
});
