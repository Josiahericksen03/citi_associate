const accountService = require("../src/services/account.service");
const customerService = require("../src/services/customer.service");
const { customers } = require("../src/data/customer.data");
const { accounts } = require("../src/data/account.data");
const { resetData } = require("./helpers/resetData");

describe("account.service", () => {
  beforeEach(() => {
    resetData();
  });

  describe("getAllAccounts", () => {
    it("success: returns all seeded accounts", () => {
      const result = accountService.getAllAccounts();
      expect(result).toHaveLength(6);
      expect(result.some((a) => a.accountNumber === "CHK-1001")).toBe(true);
    });

    it("failure: returns empty array when no accounts exist", () => {
      accounts.length = 0;
      const result = accountService.getAllAccounts();
      expect(result).toEqual([]);
    });
  });

  describe("getAccountById", () => {
    it("success: returns account when id exists", () => {
      const result = accountService.getAccountById(101);
      expect(result).not.toBeNull();
      expect(result.customerId).toBe(1);
      expect(result.accountType).toBe("Checking");
    });

    it("failure: returns null when id does not exist", () => {
      const result = accountService.getAccountById(999);
      expect(result).toBeFalsy();
    });
  });

  describe("getAccountByName", () => {
    it("success: returns accounts for customers matching name", () => {
      const result = accountService.getAccountByName("Alice");
      expect(result.length).toBe(2);
      expect(result.every((a) => a.customerId === 1)).toBe(true);
    });

    it("failure: returns empty array when customer name does not match", () => {
      const result = accountService.getAccountByName("NotARealName");
      expect(result).toEqual([]);
    });
  });

  describe("createAccount", () => {
    it("success: creates account and attaches to customer", () => {
      const result = accountService.createAccount({
        customerId: 1,
        accountNumber: "CHK-9001",
        accountType: "Checking",
        balance: 100,
      });
      expect(result).not.toBeNull();
      expect(result.id).toBe(303);
      expect(result.customerId).toBe(1);
      const customer = customerService.getCustomerById(1);
      expect(customer.accounts.some((a) => a.id === 303)).toBe(true);
    });

    it("failure: returns null when customer does not exist", () => {
      const beforeCount = accounts.length;
      const result = accountService.createAccount({
        customerId: 999,
        accountNumber: "CHK-9999",
        accountType: "Checking",
        balance: 100,
      });
      expect(result).toBeFalsy();
      expect(accounts).toHaveLength(beforeCount);
    });
  });

  describe("updateAccount", () => {
    it("success: updates accountType and balance", () => {
      const result = accountService.updateAccount(101, {
        accountType: "Savings",
        balance: 9999,
      });
      expect(result.accountType).toBe("Savings");
      expect(result.balance).toBe(9999);
    });

    it("failure: returns null when account id does not exist", () => {
      const result = accountService.updateAccount(999, {
        accountType: "Checking",
        balance: 1,
      });
      expect(result).toBeFalsy();
    });
  });

  describe("deleteAccount", () => {
    it("success: removes account from global and customer lists", () => {
      const result = accountService.deleteAccount(101);
      expect(result).not.toBeNull();
      expect(accountService.getAccountById(101)).toBeFalsy();
      const customer = customerService.getCustomerById(1);
      expect(customer.accounts.some((a) => a.id === 101)).toBe(false);
    });

    it("failure: returns null when account id does not exist", () => {
      const beforeCount = accounts.length;
      const result = accountService.deleteAccount(999);
      expect(result).toBeFalsy();
      expect(accounts).toHaveLength(beforeCount);
    });
  });

  describe("removeAccountsByCustomerId", () => {
    it("success: removes all accounts for the given customer from global list", () => {
      accountService.removeAccountsByCustomerId(1);
      expect(accounts.every((a) => a.customerId !== 1)).toBe(true);
    });

    it("failure: leaves unrelated customer accounts when id has no accounts", () => {
      const beforeCount = accounts.length;
      accountService.removeAccountsByCustomerId(999);
      expect(accounts).toHaveLength(beforeCount);
      expect(accountService.getAccountById(201)).not.toBeNull();
    });
  });
});
