# MongoDB integration notes

Quick reference for what was added when we moved from in-memory arrays to MongoDB Atlas.

## What changed (big picture)

- **Before:** Data lived in `src/data/*.data.js` (JavaScript arrays). It reset when the server stopped.
- **After:** Data lives in **MongoDB** (`Bank_DB` on Atlas). The API endpoints stayed the same; **services** now read/write the database.

`src/data/` is leftover and unused. The app does not use it anymore.

## Request flow

```
HTTP → routes → controller → service → Mongoose model → MongoDB
```

Controllers handle status codes and errors. Services contain business logic and database calls.

## New folders / files

| Location | Purpose |
|----------|---------|
| `src/config/database.js` | Connects to MongoDB using `MONGODB_URI` from `.env` |
| `src/models/` | Mongoose schemas (`customer.model.js`, `account.model.js`) → collections `customers` and `accounts` |
| `src/seed/seedData.js` | Default customers and accounts (same data we used to hardcode) |
| `src/seed/seedDatabase.js` | Inserts seed data **only if** the database has no customers |
| `src/seed/runSeed.js` | Standalone seed script (`npm run seed`) |
| `src/utils/idHelper.js` | `getNextId()` — picks the next numeric `id` when creating records |
| `src/utils/customerHelpers.js` | Loads a customer’s accounts from the `accounts` collection and attaches them to API responses |
| `.env` | `MONGODB_URI` and `PORT` (not committed; see `.gitignore`) |
| `.env.example` | Template without secrets |

## Startup order (`src/server.js`)

1. Load `.env`
2. Connect to MongoDB
3. Seed if the DB is empty
4. Start Express

## Two collections

- **customers** — `id`, `name`, `email`
- **accounts** — `id`, `customerId`, `accountNumber`, `accountType`, `balance`

Accounts link to customers via **`customerId`**. They are stored separately, not nested inside the customer document. On GET, helpers add an `accounts` array to the JSON so the API still looks familiar.

## Two kinds of IDs

- **`_id`** — MongoDB’s own ID (shows up in JSON responses)
- **`id`** — Our numeric ID used in URLs like `/api/customers/2`

MongoDB does not auto-increment our `id` field. New records use `getNextId()` (max existing `id` + 1).

## Seeding

- Runs automatically on server start when there are **zero** customers.
- Manual: clear collections in Atlas, then `npm run seed` or restart `npm run dev`.
- Does **not** re-run if data already exists (so deletes and edits persist).

## Delete customer

Deleting a customer also deletes their accounts in the service layer (`deleteMany` on `customerId`). That is cascade delete in code, not a MongoDB rule.

## Tests

`npm test` uses **mongodb-memory-server** (temporary in-memory DB), not Atlas.

`tests/helpers/resetData.js` wipes and reseeds before each test so tests stay predictable.

## Useful commands

```bash
npm run dev    # connect + seed-if-empty + API
npm run seed   # connect + seed-if-empty only
npm test       # Jest with in-memory MongoDB
```

## Config reminder

Copy `.env.example` to `.env`, set your Atlas connection string, and keep `.env` out of git.
