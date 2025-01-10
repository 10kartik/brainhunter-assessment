const mongoose = require("mongoose");
const Config = require("./mongoConnection"); // Import the Config model

const dbURI = "mongodb://localhost:27017/brainhunterAssessment";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function getConfig() {
  try {
    const configData = await Config.find({});
    return configData;
  } catch (err) {
    console.error("Error querying config data: ", err);
    throw err;
  }
}

module.exports = { getConfig };
