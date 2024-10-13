import { Bank } from './bank/bank';
import { ErrorMessages } from './messages/error-messages';

describe('Bank Flow', () => {
  let bank: Bank;
  let kangarooId: string;
  let koalaId: string;
  let crocodileId: string;

  beforeEach(() => {
    bank = new Bank();
    // Add Customers for reuse in all test cases
    kangarooId = bank.addCustomer('Kangaroo', 500).id;
    koalaId = bank.addCustomer('Koala', 300).id;
    crocodileId = bank.addCustomer('Crocodile', 100).id;
  });

  it('should allow adding customers, deposits, withdrawals, transfers, and show correct balances', () => {
    const kangaroo = bank.getCustomer(kangarooId);
    const koala = bank.getCustomer(koalaId);
    const crocodile = bank.getCustomer(crocodileId);

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
    bank.transferBetweenCustomers(kangaroo.id, crocodile.id, 150);
    expect(kangaroo.getBalance()).toBe(550);
    expect(crocodile.getBalance()).toBe(250);

    // Check Total Balance of the Bank
    expect(bank.getTotalBalance()).toBe(1000);
  });

  it('should not allow invalid operations and throw appropriate errors', () => {
    // Duplicate Customer
    expect(() => bank.addCustomer('Kangaroo', 200)).toThrow(ErrorMessages.CustomerAlreadyExists);

    // Get Non-Existent Customer
    expect(() => bank.getCustomer('non-existent-id')).toThrow(ErrorMessages.CustomerNotFound);

    // Withdraw More Than Balance
    const koala = bank.getCustomer(koalaId);
    expect(() => koala.withdraw(400)).toThrow(ErrorMessages.InsufficientFunds);

    // Transfer More Than Balance
    const kangaroo = bank.getCustomer(kangarooId);
    expect(() => bank.transferBetweenCustomers(kangaroo.id, koala.id, 600)).toThrow(ErrorMessages.InsufficientFunds);

    // Transfer to Same Account
    expect(() => kangaroo.transferTo(50, kangaroo)).toThrow(ErrorMessages.CannotTransferToSameAccount);
  });

  it('should handle concurrent operations safely', async () => {
    const customer = bank.getCustomer(kangarooId);
    let errorsCount = 0;
    // Concurrent Withdrawals
    const withdrawTasks = Array(10).fill(100).map(amount => {
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
    expect(errorsCount).toBe(5);
  });
});
