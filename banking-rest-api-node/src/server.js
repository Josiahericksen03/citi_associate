require("dotenv").config();

const connectDatabase = require("./config/database");
const seedDatabase = require("./seed/seedDatabase");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Banking REST API listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
