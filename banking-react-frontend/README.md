# Banking React Frontend

React (Vite) UI for the banking REST API. Full CRUD for customers and accounts.

## Stack

```
React (port 5173) → Express API (port 3000) → MongoDB Atlas
```

Backend must enable **CORS** for `http://localhost:5173` (configured in `banking-rest-api-node`).

## Run

**Terminal 1 — API**

```bash
cd banking-rest-api-node
npm run dev
```

**Terminal 2 — React**

```bash
cd banking-react-frontend
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Optional: copy `.env.example` to `.env` if the API is not on port 3000:

```
VITE_API_URL=http://localhost:3000
```

## Features in the UI

- **Customers:** list, create, update, delete, search by name, premium filter, nested accounts on each row
- **Accounts:** list, create, update (type + balance only), delete, search by customer name
