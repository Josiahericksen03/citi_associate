require("dotenv").config();

const connectDatabase = require("../config/database");
const seedDatabase = require("./seedDatabase");

async function run() {
  await connectDatabase();
  await seedDatabase();
  console.log("Seed complete");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
//reseed db with npm run seed