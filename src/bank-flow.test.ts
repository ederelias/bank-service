import {Bank} from "./bank/bank";
import {ErrorMessages} from "./messages/error-messages";

describe("Bank Flow", () => {
  let bank: Bank;

  beforeEach(() => {
    bank = new Bank();
  });

  it("should allow adding customers, deposits, withdrawals, transfers, and show correct balances", () => {
    // Add Customers
    const kangaroo = bank.addCustomer("Kangaroo", 500);
    const koala = bank.addCustomer("Koala", 300);
    const crocodile = bank.addCustomer("Crocodile", 100);

    // Initial Balances
    expect(kangaroo.getBalance()).toBe(500);
    expect(koala.getBalance()).toBe(300);
    expect(crocodile.getBalance()).toBe(100);

    // Deposit Money
    kangaroo.deposit(200);
    expect(kangaroo.getBalance()).toBe(700);

    // Withdraw Money
    koala.withdraw(100);
    expect(koala.getBalance()).toBe(200);

    // Transfer Money
    bank.transferBetweenCustomers("Kangaroo", "Crocodile", 150);
    expect(kangaroo.getBalance()).toBe(550);
    expect(crocodile.getBalance()).toBe(250);

    // Check Total Balance of the Bank
    expect(bank.getTotalBalance()).toBe(1000);
  });

  it("should not allow invalid operations and throw appropriate errors", () => {
    // Add Customers
    bank.addCustomer("Kangaroo", 500);
    bank.addCustomer("Koala", 300);

    // Duplicate Customer
    expect(() => bank.addCustomer("Kangaroo", 200)).toThrow(ErrorMessages.CustomerAlreadyExists);

    // Get Non-Existent Customer
    expect(() => bank.getCustomer("NonExistent")).toThrow(ErrorMessages.CustomerNotFound);

    // Withdraw More Than Balance
    const koala = bank.getCustomer("Koala");
    expect(() => koala.withdraw(400)).toThrow(ErrorMessages.InsufficientFunds);

    // Transfer More Than Balance
    const kangaroo = bank.getCustomer("Kangaroo");
    expect(() => bank.transferBetweenCustomers("Kangaroo", "Koala", 600)).toThrow(ErrorMessages.InsufficientFunds);

    // Transfer to Same Account
    expect(() => kangaroo.transferTo(50, kangaroo)).toThrow(ErrorMessages.CannotTransferToSameAccount);
  });

  it("should handle concurrent operations safely", async () => {
    // Add Customer
    const customer = bank.addCustomer("Concurrent", 1000);
    let errorsCount = 0;
    // Concurrent Withdrawals
    const withdrawTasks = Array(11).fill(100).map(amount => {

      return new Promise<void>((resolve) => {
        try {
          customer.withdraw(amount);
        } catch (e) {
          errorsCount++;
        }
        resolve();
      });
    });

    await Promise.all(withdrawTasks);
    expect(customer.getBalance()).toBeGreaterThanOrEqual(0);
    expect(errorsCount).toBe(1);
  });
});
