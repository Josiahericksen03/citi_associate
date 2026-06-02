const customerService = require("../src/services/customer.service");
const { customers } = require("../src/data/customer.data");
const { accounts } = require("../src/data/account.data");
const { resetData } = require("./helpers/resetData");

describe("customer.service", () => {
  beforeEach(() => {
    resetData();
  });

  describe("getAllCustomers", () => {
    it("success: returns all seeded customers", () => {
      const result = customerService.getAllCustomers();
      expect(result).toHaveLength(3);
      expect(result.map((c) => c.name)).toContain("Alice Johnson");
    });

    it("failure: returns empty array when no customers exist", () => {
      customers.length = 0;
      const result = customerService.getAllCustomers();
      expect(result).toEqual([]);
    });
  });

  describe("getCustomerById", () => {
    it("success: returns customer when id exists", () => {
      const result = customerService.getCustomerById(1);
      expect(result).not.toBeNull();
      expect(result.id).toBe(1);
      expect(result.email).toBe("alice.johnson@example.com");
    });

    it("failure: returns null when id does not exist", () => {
      const result = customerService.getCustomerById(999);
      expect(result).toBeFalsy();
    });
  });

  describe("getCustomerByName", () => {
    it("success: returns customers matching partial name", () => {
      const result = customerService.getCustomerByName("Alice");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].name).toContain("Alice");
    });

    it("failure: returns empty array when no name matches", () => {
      const result = customerService.getCustomerByName("NotARealName");
      expect(result).toEqual([]);
    });
  });

  describe("getAllPremiumCustomers", () => {
    it("success: returns customers with total balance above threshold", () => {
      const result = customerService.getAllPremiumCustomers();
      const names = result.map((c) => c.name);
      expect(names).toContain("Alice Johnson");
      expect(names).toContain("Carla Davis");
    });

    it("failure: excludes customers below premium threshold", () => {
      const result = customerService.getAllPremiumCustomers();
      const names = result.map((c) => c.name);
      expect(names).not.toContain("Brian Lee");
    });
  });

  describe("createCustomer", () => {
    it("success: creates customer with next id and empty accounts", () => {
      const result = customerService.createCustomer({
        name: "New Person",
        email: "new@example.com",
      });
      expect(result.id).toBe(4);
      expect(result.name).toBe("New Person");
      expect(result.accounts).toEqual([]);
      expect(customers).toHaveLength(4);
    });

    it("failure: newly created customer is not premium (no accounts yet)", () => {
      const result = customerService.createCustomer({
        name: "No Accounts",
        email: "no.accounts@example.com",
      });
      const premiumIds = customerService.getAllPremiumCustomers().map((c) => c.id);
      expect(premiumIds).not.toContain(result.id);
    });
  });

  describe("updateCustomer", () => {
    it("success: updates name and email for existing customer", () => {
      const result = customerService.updateCustomer(1, {
        name: "Alice Updated",
        email: "alice.updated@example.com",
      });
      expect(result.name).toBe("Alice Updated");
      expect(result.email).toBe("alice.updated@example.com");
    });

    it("failure: returns null when customer id does not exist", () => {
      const result = customerService.updateCustomer(999, {
        name: "Ghost",
        email: "ghost@example.com",
      });
      expect(result).toBeFalsy();
    });
  });

  describe("deleteCustomer", () => {
    it("success: removes customer and cascades account deletion", () => {
      const result = customerService.deleteCustomer(1);
      expect(result).not.toBeNull();
      expect(result.id).toBe(1);
      expect(customerService.getCustomerById(1)).toBeFalsy();
      expect(accounts.every((a) => a.customerId !== 1)).toBe(true);
    });

    it("failure: returns null when customer id does not exist", () => {
      const beforeCount = customers.length;
      const result = customerService.deleteCustomer(999);
      expect(result).toBeFalsy();
      expect(customers).toHaveLength(beforeCount);
    });
  });
});
