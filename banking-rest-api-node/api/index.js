require("dotenv").config();

const connectDatabase = require("../src/config/database");
const seedDatabase = require("../src/seed/seedDatabase");
const app = require("../src/app");

let initPromise = null;

function ensureReady() {
  if (!initPromise) {
    initPromise = connectDatabase()
      .then(() => seedDatabase())
      .catch((error) => {
        initPromise = null;
        throw error;
      });
  }
  return initPromise;
}

module.exports = async (req, res) => {
  await ensureReady();
  return app(req, res);
};
