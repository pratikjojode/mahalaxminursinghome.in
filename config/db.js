const mongoose = require("mongoose");
const colors = require("colors");

// function to connect to database

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Mahalaxmi Nursing Database connected to ${mongoose.connection.host}`
        .bgBlue.white
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;
