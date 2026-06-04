import { Fragment, useCallback, useEffect, useState } from "react";
import { accountsApi } from "../api/client.js";
import { formatCurrency } from "../utils/format.js";

const emptyForm = {
  customerId: "",
  accountNumber: "",
  accountType: "Checking",
  balance: "",
};

function CreateAccountFields({ form, setForm }) {
  return (
    <>
      <label>
        Customer ID
        <input
          required
          type="number"
          min="1"
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          placeholder="1"
        />
      </label>
      <label>
        Account number
        <input
          required
          value={form.accountNumber}
          onChange={(e) =>
            setForm({ ...form, accountNumber: e.target.value })
          }
          placeholder="CHK-5001"
        />
      </label>
      <label>
        Account type
        <select
          value={form.accountType}
          onChange={(e) => setForm({ ...form, accountType: e.target.value })}
        >
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
      </label>
      <label>
        Balance
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={form.balance}
          onChange={(e) => setForm({ ...form, balance: e.target.value })}
          placeholder="0.00"
        />
      </label>
    </>
  );
}

function EditAccountFields({ form, setForm }) {
  return (
    <>
      <label>
        Account type
        <select
          value={form.accountType}
          onChange={(e) => setForm({ ...form, accountType: e.target.value })}
        >
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
      </label>
      <label>
        Balance
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={form.balance}
          onChange={(e) => setForm({ ...form, balance: e.target.value })}
          placeholder="0.00"
        />
      </label>
    </>
  );
}

export default function AccountSection({ onError, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        isSearch && searchName.trim()
          ? await accountsApi.search(searchName.trim())
          : await accountsApi.getAll();
      setAccounts(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isSearch, searchName, onError]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

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

  function startEdit(account) {
    setShowCreateForm(false);
    setEditingId(account.id);
    setForm({
      customerId: String(account.customerId),
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: String(account.balance),
    });
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    try {
      await accountsApi.create({
        customerId: Number(form.customerId),
        accountNumber: form.accountNumber,
        accountType: form.accountType,
        balance: Number(form.balance),
      });
      onSuccess("Account created");
      setForm(emptyForm);
      setShowCreateForm(false);
      setIsSearch(false);
      await loadAccounts();
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    try {
      await accountsApi.update(editingId, {
        accountType: form.accountType,
        balance: Number(form.balance),
      });
      onSuccess(`Account ${editingId} updated`);
      setForm(emptyForm);
      setEditingId(null);
      await loadAccounts();
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete account ${id}?`)) {
      return;
    }
    try {
      await accountsApi.remove(id);
      onSuccess(`Account ${id} deleted`);
      if (editingId === id) {
        cancelEdit();
      }
      await loadAccounts();
    } catch (err) {
      onError(err.message);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setIsSearch(true);
  }

  function showAll() {
    setIsSearch(false);
    setSearchName("");
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Accounts</h2>
          <p className="panel-desc">
            {isSearch ? "Filtered by customer name" : "All bank accounts"}
          </p>
        </div>
        <div className="stat-pill">
          <span className="stat-value">{accounts.length}</span>
          <span className="stat-label">records</span>
        </div>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className={!isSearch ? "btn btn-filter active" : "btn btn-filter"}
          onClick={showAll}
        >
          All accounts
        </button>
        <button type="button" className="btn btn-primary" onClick={startCreate}>
          + Open account
        </button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search by customer name…"
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
            <h3>Open new account</h3>
            <p>Link a new account to an existing customer.</p>
          </div>
          <div className="create-account-fields">
            <CreateAccountFields form={form} setForm={setForm} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create account
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
            <p>Loading accounts…</p>
          </div>
        ) : accounts.length === 0 && !showCreateForm ? (
          <div className="empty-state">
            <p>No accounts found</p>
            <span>Open a new account or adjust your search.</span>
          </div>
        ) : accounts.length === 0 ? (
          <p className="muted empty-hint">No accounts yet — create one above.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const isEditing = editingId === account.id;

                  return (
                    <Fragment key={account.id}>
                      <tr className={isEditing ? "row-editing" : ""}>
                        <td>
                          <div className="cell-primary account-number">
                            {account.accountNumber}
                          </div>
                          <div className="cell-muted">ID #{account.id}</div>
                        </td>
                        <td>
                          <span className="chip chip-neutral">
                            Customer #{account.customerId}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              account.accountType === "Savings"
                                ? "badge badge-savings"
                                : "badge badge-checking"
                            }
                          >
                            {account.accountType}
                          </span>
                        </td>
                        <td>
                          <span className="balance">
                            {formatCurrency(account.balance)}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            type="button"
                            className={
                              isEditing ? "btn btn-ghost active" : "btn btn-ghost"
                            }
                            onClick={() =>
                              isEditing ? cancelEdit() : startEdit(account)
                            }
                          >
                            {isEditing ? "Cancel" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(account.id)}
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
                                <h4>Edit account #{account.id}</h4>
                                <p className="inline-edit-meta">
                                  {account.accountNumber} · Customer #
                                  {account.customerId}
                                </p>
                              </div>
                              <div className="inline-edit-fields">
                                <EditAccountFields form={form} setForm={setForm} />
                              </div>
                              <p className="hint">
                                Only account type and balance can be updated.
                              </p>
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
