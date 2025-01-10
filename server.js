const express = require("express");
const { fetchUsers } = require("./service");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/users", async (req, res) => {
  const { limit = 10, page = 1, sort = "name", search = {} } = req.query;

  // Fetch all users
  const allUsers = await fetchUsers();

  // Filter users based on search criteria
  const filteredUsers = allUsers.filter((user) => {
    return Object.keys(search).every((key) => {
      return (
        user[key] &&
        user[key].toString().toLowerCase().includes(search[key].toLowerCase())
      );
    });
  });

  // Sort users
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sort] < b[sort]) return -1;
    if (a[sort] > b[sort]) return 1;
    return 0;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  res.json({
    total: sortedUsers.length,
    page: parseInt(page),
    limit: parseInt(limit),
    users: paginatedUsers,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
