const axios = require("axios"); // Import axios for making HTTP requests
const { getConfig } = require("./queryConfig"); // Import the getConfig function to fetch configuration data

// Define an asynchronous function to fetch users
const fetchUsers = async () => {
  try {
    // Fetch configuration data from the database
    const configData = await getConfig();
    console.log("Config Data: ", configData);

    // Destructure configuration data
    let {
      sleepTime,
      requestsPerBatch,
      requestsPerSecond,
      batchSleep,
      apiDetails,
    } = configData[0];

    // Destructure API details from configuration data
    let { url, resultsPerRequest } = apiDetails;

    // Set default values if configuration values are not provided
    sleepTime = sleepTime || 5000;
    requestsPerBatch = requestsPerBatch || 5;
    requestsPerSecond = requestsPerSecond || 2;
    batchSleep = batchSleep || 5000;
    resultsPerRequest = resultsPerRequest || 3;

    // Set default URL if not provided
    url = url || "https://randomuser.me/api/";

    // Append resultsPerRequest to the URL
    url = `${url}?results=${resultsPerRequest}`;
    console.log("URL: ", url);

    // Define a sleep function to pause execution for a given time
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let allUsers = []; // Initialize an array to store all fetched users

    const promises = []; // Initialize an array to store promises for HTTP requests
    for (let i = 0; i < requestsPerSecond; i++) {
      promises.push(axios.get(url)); // Add a new HTTP request promise to the array

      // If the number of requests per second is reached
      if ((i + 1) % requestsPerSecond === 0) {
        const result = await Promise.all(promises); // Wait for all promises to resolve

        // Concatenate the results of each request to the allUsers array
        result.forEach((res) => {
          allUsers = allUsers.concat(res.data.results);
        });

        await sleep(sleepTime); // Pause execution for sleepTime milliseconds
        promises.length = 0; // Reset the promises array
      }
      await sleep(batchSleep); // Pause execution for batchSleep milliseconds
    }

    console.log("All Users: ", allUsers); // Log the array of all fetched users
    return allUsers; // Return the array of all fetched users
  } catch (err) {
    console.log("Error fetching users: ", err);
    throw err; // Throw an error if any occurs
  }
};

module.exports = { fetchUsers };
 // Export the fetchUsers function as the default export
// fetchUsers(); // Uncomment this line to run the fetchUsers function immediately
