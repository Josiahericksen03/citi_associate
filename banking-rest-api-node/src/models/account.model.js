class Account {
  constructor({ id, customerId, accountNumber, accountType, balance }) {
    this.id = id;
    this.customerId = customerId;
    this.accountNumber = accountNumber;
    this.accountType = accountType;
    this.balance = balance;
  }
}

module.exports = Account;
