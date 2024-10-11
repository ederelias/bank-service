import { Bank } from "./bank";
import {ErrorMessages} from "../messages/error-messages";

describe("Bank System", () => {
    let bank: Bank;

    beforeEach(() => {
        bank = new Bank();
    });

    it("should allow a customer to join the bank", () => {
        const customer = bank.addCustomer("Kanguru", 100);
        expect(customer.getBalance()).toBe(100);
    });

    it("should  not allow a customer to join the bank with a negative deposit", () => {
        expect(() => bank.addCustomer("Kanguru", -1)).toThrow(ErrorMessages.InitialDepositNonNegative);
    });

    it("should not found a non exist customer", () => {
        expect(() => bank.getCustomer("Kanguru")).toThrow(ErrorMessages.CustomerNotFound);
    });

    it("should not allow adding a customer with a duplicate name", () => {
        bank.addCustomer("Kanguru", 100);
        expect(() => bank.addCustomer("Kanguru", 200)).toThrow(ErrorMessages.CustomerAlreadyExists);
    });

    it("should allow the bank to transfer money between customers", () => {
        bank.addCustomer("Kanguru", 200);
        bank.addCustomer("Koala", 100);
        bank.transferBetweenCustomers("Kanguru", "Koala", 50);
        expect(bank.getCustomer("Kanguru").getBalance()).toBe(150);
        expect(bank.getCustomer("Koala").getBalance()).toBe(150);
    });

    it("should show the total balance of the bank", () => {
        bank.addCustomer("Kanguru", 200);
        bank.addCustomer("Koala", 300);
        expect(bank.getTotalBalance()).toBe(500);
    });

    it("should handle concurrent withdrawals safely", async () => {
        const customer = bank.addCustomer("Concurrent", 1000);
        const withdrawTasks = Array(10).fill(100).map(amount => {
            return new Promise<void>((resolve) => {
                try {
                    customer.withdraw(amount);
                } catch (e) {
                    // Ignoring errors for insufficient funds
                }
                resolve();
            });
        });

        await Promise.all(withdrawTasks);
        expect(customer.getBalance()).toBeGreaterThanOrEqual(0);
    });
});
