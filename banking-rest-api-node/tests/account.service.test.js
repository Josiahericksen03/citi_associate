const accountService = require("../src/services/account.service");
const customerService = require("../src/services/customer.service");
const Account = require("../src/models/account.model");

describe("account.service", () => {
  describe("getAllAccounts", () => {
    it("success: returns all seeded accounts", async () => {
      const result = await accountService.getAllAccounts();
      expect(result).toHaveLength(6);
      expect(result.some((a) => a.accountNumber === "CHK-1001")).toBe(true);
    });

    it("failure: returns empty array when no accounts exist", async () => {
      await Account.deleteMany({});
      const result = await accountService.getAllAccounts();
      expect(result).toEqual([]);
    });
  });

  describe("getAccountById", () => {
    it("success: returns account when id exists", async () => {
      const result = await accountService.getAccountById(101);
      expect(result).not.toBeNull();
      expect(result.customerId).toBe(1);
      expect(result.accountType).toBe("Checking");
    });

    it("failure: returns null when id does not exist", async () => {
      const result = await accountService.getAccountById(999);
      expect(result).toBeFalsy();
    });
  });

  describe("getAccountByName", () => {
    it("success: returns accounts for customers matching name", async () => {
      const result = await accountService.getAccountByName("Alice");
      expect(result.length).toBe(2);
      expect(result.every((a) => a.customerId === 1)).toBe(true);
    });

    it("failure: returns empty array when customer name does not match", async () => {
      const result = await accountService.getAccountByName("NotARealName");
      expect(result).toEqual([]);
    });
  });

  describe("createAccount", () => {
    it("success: creates account and attaches to customer", async () => {
      const result = await accountService.createAccount({
        customerId: 1,
        accountNumber: "CHK-9001",
        accountType: "Checking",
        balance: 100,
      });
      expect(result).not.toBeNull();
      expect(result.id).toBe(303);
      expect(result.customerId).toBe(1);
      const customer = await customerService.getCustomerById(1);
      expect(customer.accounts.some((a) => a.id === 303)).toBe(true);
    });

    it("failure: returns null when customer does not exist", async () => {
      const beforeCount = await Account.countDocuments();
      const result = await accountService.createAccount({
        customerId: 999,
        accountNumber: "CHK-9999",
        accountType: "Checking",
        balance: 100,
      });
      expect(result).toBeFalsy();
      expect(await Account.countDocuments()).toBe(beforeCount);
    });
  });

  describe("updateAccount", () => {
    it("success: updates accountType and balance", async () => {
      const result = await accountService.updateAccount(101, {
        accountType: "Savings",
        balance: 9999,
      });
      expect(result.accountType).toBe("Savings");
      expect(result.balance).toBe(9999);
    });

    it("failure: returns null when account id does not exist", async () => {
      const result = await accountService.updateAccount(999, {
        accountType: "Checking",
        balance: 1,
      });
      expect(result).toBeFalsy();
    });
  });

  describe("deleteAccount", () => {
    it("success: removes account from database", async () => {
      const result = await accountService.deleteAccount(101);
      expect(result).not.toBeNull();
      expect(await accountService.getAccountById(101)).toBeFalsy();
      const customer = await customerService.getCustomerById(1);
      expect(customer.accounts.some((a) => a.id === 101)).toBe(false);
    });

    it("failure: returns null when account id does not exist", async () => {
      const beforeCount = await Account.countDocuments();
      const result = await accountService.deleteAccount(999);
      expect(result).toBeFalsy();
      expect(await Account.countDocuments()).toBe(beforeCount);
    });
  });
});
