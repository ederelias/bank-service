import { Customer } from '../customer/customer';
import { ErrorMessages } from '../messages/error-messages';
import { v4 as uuidv4 } from 'uuid';

export class Bank {
    public readonly id: string;
    private customers: Map<string, Customer>;

    constructor() {
        this.id = uuidv4();
        this.customers = new Map();
    }

    /**
     * Adds a new customer to the bank.
     * @param name - The name of the customer.
     * @param initialDeposit - The initial deposit amount.
     * @returns The newly created customer.
     * @throws Error if the customer already exists.
     */
    public addCustomer(name: string, initialDeposit: number): Customer {
        if (this.findCustomerByName(name)) {
            throw new Error(ErrorMessages.CustomerAlreadyExists);
        }
        const customer = new Customer(name, initialDeposit);
        this.customers.set(customer.id, customer);
        return customer;
    }

    /**
     * Retrieves a customer by their ID.
     * @param customerId - The ID of the customer.
     * @returns The customer object.
     * @throws Error if the customer is not found.
     */
    public getCustomer(customerId: string): Customer {
        const customer = this.customers.get(customerId);
        if (!customer) {
            throw new Error(ErrorMessages.CustomerNotFound);
        }
        return customer;
    }

    /**
     * Calculates the total balance of all customers in the bank.
     * @returns The total balance.
     */
    public getTotalBalance(): number {
        return Array.from(this.customers.values()).reduce((acc, customer) => acc + customer.getBalance(), 0);
    }

    /**
     * Transfers an amount between two customers.
     * @param senderId - The ID of the sender.
     * @param recipientId - The ID of the recipient.
     * @param amount - The amount to be transferred.
     * @throws Error if the sender or recipient is not found or if the transfer fails.
     */
    public transferBetweenCustomers(senderId: string, recipientId: string, amount: number): void {
        if (senderId === recipientId) {
            throw new Error(ErrorMessages.InvalidTransfer);
        }

        const sender = this.getCustomer(senderId);
        const recipient = this.getCustomer(recipientId);

        this.executeTransaction(sender, recipient, amount);
    }

    /**
     * Executes a synchronized transaction between sender and recipient.
     * @param sender - The sender customer.
     * @param recipient - The recipient customer.
     * @param amount - The amount to be transferred.
     */
    private executeTransaction(sender: Customer, recipient: Customer, amount: number): void {
        synchronized([sender, recipient].sort((a, b) => a.id.localeCompare(b.id)), () => {
            sender.withdraw(amount);
            recipient.deposit(amount);
        });
    }

    /**
     * Finds a customer by their name.
     * @param name - The name of the customer.
     * @returns The customer object or undefined if not found.
     */
    public findCustomerByName(name: string): Customer | undefined {
        for (const customer of this.customers.values()) {
            if (customer.name === name) {
                return customer;
            }
        }
        return undefined;
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
