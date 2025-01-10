const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/brainhunterAssessment";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const configSchema = new mongoose.Schema({
  sleepTime: {
    type: Number,
    required: true,
  },
  requestsPerBatch: {
    type: Number,
    required: true,
  },
  requestsPerSecond: {
    type: Number,
    required: true,
  },
  batchSleep: {
    type: Number,
    required: true,
  },
  apiDetails: {
    type: Object,
    required: true,
  },
});

const Config = mongoose.model("Config", configSchema);

// seed the database
async function initializeConfig() {
  try {
    const data = await Config.findOne({});
    if (!data) {
      await Config.create({
        sleepTime: 5000,
        requestsPerBatch: 5,
        requestsPerSecond: 2,
        batchSleep: 5000,
        apiDetails: {
          url: "https://randomuser.me/api/",
          resultsPerRequest: 3,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

initializeConfig();

module.exports = Config;
