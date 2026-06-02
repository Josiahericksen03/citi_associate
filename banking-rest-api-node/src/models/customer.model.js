class Customer {
  constructor({ id, name, email, accounts = [] }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.accounts = accounts;
  }
}

module.exports = Customer;
