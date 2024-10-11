import { Customer } from "./customer";
import {ErrorMessages} from "../messages/error-messages";

describe("Customer Class", () => {
    it("should allow a customer to deposit money", () => {
        const customer = new Customer("Crocodile", 50);
        customer.deposit(30);
        expect(customer.getBalance()).toBe(80);
    });

    it("should not allow depositing non-positive amounts", () => {
        const customer = new Customer("Crocodile", 50);
        expect(() => customer.deposit(0)).toThrow(ErrorMessages.DepositAmountPositive);
        expect(() => customer.deposit(-10)).toThrow(ErrorMessages.DepositAmountPositive);
    });

    it("should not allow a customer to withdraw more than their balance", () => {
        const customer = new Customer("Spider", 50);
        expect(() => customer.withdraw(60)).toThrow(ErrorMessages.InsufficientFunds);
    });

    it("should not allow withdrawing non-positive amounts", () => {
        const customer = new Customer("Spider", 50);
        expect(() => customer.withdraw(0)).toThrow(ErrorMessages.WithdrawAmountPositive);
        expect(() => customer.withdraw(-10)).toThrow(ErrorMessages.WithdrawAmountPositive);
    });

    it("should allow a customer to transfer money to another customer", () => {
        const koala = new Customer("Koala", 200);
        const crocodile = new Customer("Crocodile", 100);
        koala.transferTo(50, crocodile);
        expect(koala.getBalance()).toBe(150);
        expect(crocodile.getBalance()).toBe(150);
    });

    it("should not allow transferring money to the same customer", () => {
        const koala = new Customer("Koala", 200);
        expect(() => koala.transferTo(50, koala)).toThrow(ErrorMessages.CannotTransferToSameAccount);
    });
});
