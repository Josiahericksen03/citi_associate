const customerService = require("../src/services/customer.service");
const Customer = require("../src/models/customer.model");
const Account = require("../src/models/account.model");

describe("customer.service", () => {
  describe("getAllCustomers", () => {
    it("success: returns all seeded customers", async () => {
      const result = await customerService.getAllCustomers();
      expect(result).toHaveLength(3);
      expect(result.map((c) => c.name)).toContain("Alice Johnson");
    });

    it("failure: returns empty array when no customers exist", async () => {
      await Customer.deleteMany({});
      const result = await customerService.getAllCustomers();
      expect(result).toEqual([]);
    });
  });

  describe("getCustomerById", () => {
    it("success: returns customer when id exists", async () => {
      const result = await customerService.getCustomerById(1);
      expect(result).not.toBeNull();
      expect(result.id).toBe(1);
      expect(result.email).toBe("alice.johnson@example.com");
    });

    it("failure: returns null when id does not exist", async () => {
      const result = await customerService.getCustomerById(999);
      expect(result).toBeFalsy();
    });
  });

  describe("getCustomerByName", () => {
    it("success: returns customers matching partial name", async () => {
      const result = await customerService.getCustomerByName("Alice");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].name).toContain("Alice");
    });

    it("failure: returns empty array when no name matches", async () => {
      const result = await customerService.getCustomerByName("NotARealName");
      expect(result).toEqual([]);
    });
  });

  describe("getAllPremiumCustomers", () => {
    it("success: returns customers with total balance above threshold", async () => {
      const result = await customerService.getAllPremiumCustomers();
      const names = result.map((c) => c.name);
      expect(names).toContain("Alice Johnson");
      expect(names).toContain("Carla Davis");
    });

    it("failure: excludes customers below premium threshold", async () => {
      const result = await customerService.getAllPremiumCustomers();
      const names = result.map((c) => c.name);
      expect(names).not.toContain("Brian Lee");
    });
  });

  describe("createCustomer", () => {
    it("success: creates customer with next id and empty accounts", async () => {
      const result = await customerService.createCustomer({
        name: "New Person",
        email: "new@example.com",
      });
      expect(result.id).toBe(4);
      expect(result.name).toBe("New Person");
      expect(result.accounts).toEqual([]);
      expect(await Customer.countDocuments()).toBe(4);
    });

    it("failure: newly created customer is not premium (no accounts yet)", async () => {
      const result = await customerService.createCustomer({
        name: "No Accounts",
        email: "no.accounts@example.com",
      });
      const premium = await customerService.getAllPremiumCustomers();
      const premiumIds = premium.map((c) => c.id);
      expect(premiumIds).not.toContain(result.id);
    });
  });

  describe("updateCustomer", () => {
    it("success: updates name and email for existing customer", async () => {
      const result = await customerService.updateCustomer(1, {
        name: "Alice Updated",
        email: "alice.updated@example.com",
      });
      expect(result.name).toBe("Alice Updated");
      expect(result.email).toBe("alice.updated@example.com");
    });

    it("failure: returns null when customer id does not exist", async () => {
      const result = await customerService.updateCustomer(999, {
        name: "Ghost",
        email: "ghost@example.com",
      });
      expect(result).toBeFalsy();
    });
  });

  describe("deleteCustomer", () => {
    it("success: removes customer and cascades account deletion", async () => {
      const result = await customerService.deleteCustomer(1);
      expect(result).not.toBeNull();
      expect(result.id).toBe(1);
      expect(await customerService.getCustomerById(1)).toBeFalsy();
      const remainingAccounts = await Account.find({ customerId: 1 }).lean();
      expect(remainingAccounts).toHaveLength(0);
    });

    it("failure: returns null when customer id does not exist", async () => {
      const beforeCount = await Customer.countDocuments();
      const result = await customerService.deleteCustomer(999);
      expect(result).toBeFalsy();
      expect(await Customer.countDocuments()).toBe(beforeCount);
    });
  });
});
