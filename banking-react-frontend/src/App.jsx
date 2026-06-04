import { useState } from "react";
import CustomerSection from "./components/CustomerSection.jsx";
import AccountSection from "./components/AccountSection.jsx";

const TABS = [
  { id: "customers", label: "Customers", icon: "👤" },
  { id: "accounts", label: "Accounts", icon: "💳" },
];

export default function App() {
  const [tab, setTab] = useState("customers");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function showError(message) {
    setSuccess("");
    setError(message);
  }

  function showSuccess(message) {
    setError("");
    setSuccess(message);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              C
            </div>
            <div>
              <h1>Citi Associate Bank</h1>
              <p className="brand-tagline">Customer &amp; account management</p>
            </div>
          </div>
          <nav className="main-nav" aria-label="Main navigation">
            {TABS.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                className={tab === id ? "nav-link active" : "nav-link"}
                onClick={() => {
                  setTab(id);
                  clearMessages();
                }}
              >
                <span className="nav-icon" aria-hidden="true">
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="app-body">
        {(error || success) && (
          <div
            className={`toast ${error ? "toast-error" : "toast-success"}`}
            role="status"
          >
            <span>{error || success}</span>
            <button
              type="button"
              className="toast-close"
              onClick={clearMessages}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <main className="main-content">
          {tab === "customers" ? (
            <CustomerSection onError={showError} onSuccess={showSuccess} />
          ) : (
            <AccountSection onError={showError} onSuccess={showSuccess} />
          )}
        </main>

        <footer className="app-footer">
          React → Express API → MongoDB Atlas
        </footer>
      </div>
    </div>
  );
}
