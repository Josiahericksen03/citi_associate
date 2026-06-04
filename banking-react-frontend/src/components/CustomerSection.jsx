import { Fragment, useCallback, useEffect, useState } from "react";
import { customersApi } from "../api/client.js";
import {
  formatCurrency,
  getInitials,
  getTotalBalance,
} from "../utils/format.js";

const emptyForm = { name: "", email: "" };
const PREMIUM_THRESHOLD = 10000;

const viewLabels = {
  all: "All customers",
  premium: "Premium customers",
  search: "Search results",
};

function CustomerFormFields({ form, setForm }) {
  return (
    <>
      <label>
        Full name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Jane Smith"
        />
      </label>
      <label>
        Email address
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jane@email.com"
        />
      </label>
    </>
  );
}

export default function CustomerSection({ onError, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [view, setView] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (view === "premium") {
        data = await customersApi.getPremium();
      } else if (view === "search" && searchName.trim()) {
        data = await customersApi.search(searchName.trim());
      } else {
        data = await customersApi.getAll();
      }
      setCustomers(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }, [view, searchName, onError]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function cancelCreate() {
    setShowCreateForm(false);
    setForm(emptyForm);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowCreateForm(true);
  }

  function startEdit(customer) {
    setShowCreateForm(false);
    setEditingId(customer.id);
    setForm({ name: customer.name, email: customer.email });
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    try {
      await customersApi.create(form);
      onSuccess("Customer created");
      setForm(emptyForm);
      setShowCreateForm(false);
      setView("all");
      await loadCustomers();
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    try {
      await customersApi.update(editingId, form);
      onSuccess(`Customer ${editingId} updated`);
      setForm(emptyForm);
      setEditingId(null);
      await loadCustomers();
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete customer ${id} and all their accounts?`)) {
      return;
    }
    try {
      await customersApi.remove(id);
      onSuccess(`Customer ${id} deleted`);
      if (editingId === id) {
        cancelEdit();
      }
      await loadCustomers();
    } catch (err) {
      onError(err.message);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setView("search");
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Customers</h2>
          <p className="panel-desc">{viewLabels[view]}</p>
        </div>
        <div className="stat-pill">
          <span className="stat-value">{customers.length}</span>
          <span className="stat-label">records</span>
        </div>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className={view === "all" ? "btn btn-filter active" : "btn btn-filter"}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          type="button"
          className={
            view === "premium" ? "btn btn-filter active" : "btn btn-filter"
          }
          onClick={() => setView("premium")}
        >
          ★ Premium
        </button>
        <button type="button" className="btn btn-primary" onClick={startCreate}>
          + New customer
        </button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search customers by name…"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
      </form>

      {showCreateForm && (
        <form
          className="form-card form-card-inline"
          onSubmit={handleCreateSubmit}
        >
          <div className="form-card-header">
            <h3>New customer</h3>
            <p>Add a new customer to the bank.</p>
          </div>
          <CustomerFormFields form={form} setForm={setForm} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create customer
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelCreate}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="data-card data-card-full">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading customers…</p>
          </div>
        ) : customers.length === 0 && !showCreateForm ? (
          <div className="empty-state">
            <p>No customers found</p>
            <span>Try a different search or add a new customer.</span>
          </div>
        ) : customers.length === 0 ? (
          <p className="muted empty-hint">No customers yet — create one above.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Accounts</th>
                  <th>Total balance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const total = getTotalBalance(customer.accounts);
                  const isPremium = total > PREMIUM_THRESHOLD;
                  const isEditing = editingId === customer.id;

                  return (
                    <Fragment key={customer.id}>
                      <tr className={isEditing ? "row-editing" : ""}>
                        <td>
                          <div className="customer-cell">
                            <div className="avatar">
                              {getInitials(customer.name)}
                            </div>
                            <div>
                              <div className="cell-primary">
                                {customer.name}
                                {isPremium && (
                                  <span className="badge badge-gold">Premium</span>
                                )}
                              </div>
                              <div className="cell-muted">ID #{customer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="cell-primary">{customer.email}</div>
                        </td>
                        <td>
                          {customer.accounts?.length ? (
                            <div className="chip-group">
                              {customer.accounts.map((account) => (
                                <span
                                  key={account.id}
                                  className={
                                    account.accountType === "Savings"
                                      ? "chip chip-savings"
                                      : "chip chip-checking"
                                  }
                                >
                                  {account.accountNumber} ·{" "}
                                  {formatCurrency(account.balance)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="cell-muted">No accounts</span>
                          )}
                        </td>
                        <td>
                          <span className="balance">{formatCurrency(total)}</span>
                        </td>
                        <td className="actions">
                          <button
                            type="button"
                            className={isEditing ? "btn btn-ghost active" : "btn btn-ghost"}
                            onClick={() =>
                              isEditing ? cancelEdit() : startEdit(customer)
                            }
                          >
                            {isEditing ? "Cancel" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {isEditing && (
                        <tr className="inline-edit-row">
                          <td colSpan={5}>
                            <form
                              className="inline-edit-form"
                              onSubmit={handleEditSubmit}
                            >
                              <div className="inline-edit-header">
                                <h4>Edit customer #{customer.id}</h4>
                              </div>
                              <div className="inline-edit-fields">
                                <CustomerFormFields form={form} setForm={setForm} />
                              </div>
                              <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                  Save changes
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
