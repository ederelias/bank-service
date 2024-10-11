import {ErrorMessages} from "../messages/error-messages";

import { v4 as uuidv4 } from "uuid";

export class Customer {
    public readonly id: string;
    public readonly name: string;
    private balance: number;

    constructor(name: string, initialDeposit: number) {
        this.id = uuidv4();
        if (initialDeposit < 0) {
            throw new Error(ErrorMessages.InitialDepositNonNegative);
        }
        this.name = name;
        this.balance = initialDeposit;
    }

    public deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error(ErrorMessages.DepositAmountPositive);
        }
        this.balance += amount;
    }

    public withdraw(amount: number): void {
        synchronized(this, () => {
            if (amount > this.balance) {
                throw new Error(ErrorMessages.InsufficientFunds);
            }
            if (amount <= 0) {
                throw new Error(ErrorMessages.WithdrawAmountPositive);
            }
            this.balance -= amount;
        });
    }

    public getBalance(): number {
        return this.balance;
    }

    public transferTo(amount: number, recipient: Customer): void {
        if (recipient === this) {
            throw new Error(ErrorMessages.CannotTransferToSameAccount);
        }
        this.withdraw(amount);
        recipient.deposit(amount);
    }
}
// Simulating lock mechanism
function synchronized<T>(locks: T | T[], fn: () => void): void {
    fn();
}
