import { ErrorMessages } from '../messages/error-messages';
import { v4 as uuidv4 } from 'uuid';

export class Customer {
    public readonly id: string;
    public readonly name: string;
    private balance: number;

    constructor(name: string, initialDeposit: number) {
        if (initialDeposit < 0) {
            throw new Error(ErrorMessages.InitialDepositNonNegative);
        }
        this.id = uuidv4();
        this.name = name;
        this.balance = initialDeposit;
    }

    /**
     * Deposits a specified amount into the customer's account.
     * @param amount - The amount to deposit.
     * @throws Error if the amount is not positive.
     */
    public deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error(ErrorMessages.DepositAmountPositive);
        }
        this.balance += amount;
    }

    /**
     * Withdraws a specified amount from the customer's account.
     * @param amount - The amount to withdraw.
     * @throws Error if the amount is greater than the balance or non-positive.
     */
    public withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error(ErrorMessages.WithdrawAmountPositive);
        }
        if (amount > this.balance) {
            throw new Error(ErrorMessages.InsufficientFunds);
        }

        synchronized(this, () => {
            this.balance -= amount;
        });
    }

    /**
     * Retrieves the current balance of the customer's account.
     * @returns The current balance.
     */
    public getBalance(): number {
        return this.balance;
    }

    /**
     * Transfers a specified amount to another customer.
     * @param amount - The amount to transfer.
     * @param recipient - The recipient customer.
     * @throws Error if attempting to transfer to the same account or if the transfer fails.
     */
    public transferTo(amount: number, recipient: Customer): void {
        if (recipient === this) {
            throw new Error(ErrorMessages.CannotTransferToSameAccount);
        }

        synchronized([this, recipient].sort((a, b) => a.id.localeCompare(b.id)), () => {
            this.withdraw(amount);
            recipient.deposit(amount);
        });
    }
}

/**
 * Synchronizes the execution of a function across multiple locks.
 * @param locks - The locks to synchronize.
 * @param fn - The function to execute.
 */
function synchronized<T>(locks: T | T[], fn: () => void): void {
    // Simulating lock mechanism
    fn();
}
