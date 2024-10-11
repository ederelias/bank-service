import {Customer} from "../customer/customer";
import {ErrorMessages} from "../messages/error-messages";

import { v4 as uuidv4 } from 'uuid';

export class Bank {
    public readonly id: string;
    private customers: Map<string, Customer>;

    constructor() {
        this.id = uuidv4();
        this.customers = new Map();
    }

    public addCustomer(name: string, initialDeposit: number): Customer {
        if (this.customers.has(name)) {
            throw new Error(ErrorMessages.CustomerAlreadyExists);
        }
        const customer = new Customer(name, initialDeposit);
        this.customers.set(name, customer);
        return customer;
    }

    public getCustomer(name: string): Customer {
        const customer = this.customers.get(name);
        if (!customer) {
            throw new Error(ErrorMessages.CustomerNotFound);
        }
        return customer;
    }


    public getTotalBalance(): number {
        return Array.from(this.customers.values()).reduce((acc, customer) => acc + customer.getBalance(), 0);
    }

    public transferBetweenCustomers(senderName: string, recipientName: string, amount: number): void {
        const sender = this.getCustomer(senderName);
        const recipient = this.getCustomer(recipientName);

        synchronized([sender, recipient].sort((a, b) => a.id.localeCompare(b.id)), () => {
            sender.transferTo(amount, recipient);
        });
    }
}

function synchronized<T>(locks: T | T[], fn: () => void): void {
    // Simulating lock mechanism
    fn();
}
