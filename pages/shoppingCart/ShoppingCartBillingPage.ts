import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ShoppingCartPaymentPage } from "./ShoppingCartPaymentPage";
const user = require("../../types/user")

export class ShoppingCartBillingPage extends BasePage {

    private readonly street: Locator;
    private readonly city: Locator;
    private readonly state: Locator;
    private readonly postCode: Locator;
    private readonly proceesToCheckOutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.street = page.getByTestId('street');
        this.city = page.getByTestId('city');
        this.state = page.getByTestId('state');
        this.postCode = page.getByTestId('postal_code');
        this.proceesToCheckOutButton = page.getByRole('button', {name: 'Proceed to checkout'}); 
    }

    async getStreetInput(): Promise<string> {
        return await this.street.inputValue();
    }

    async getCityInput(): Promise<string> {
        return await this.city.inputValue();
    }

    async getStateInput(): Promise<string> {
        return await this.state.inputValue();
    }

    async getPostCodeInput(): Promise<string> {
        return await this.postCode.inputValue();
    }

    async getBillingAddresInputFields(): Promise<string[]> {

        return await Promise.all([this.getStreetInput(), this.getCityInput(), this.getStateInput(), this.getPostCodeInput()]);
    }

    async clickProceedToCheckout(): Promise<ShoppingCartPaymentPage> {
        await this.proceesToCheckOutButton.click();

        return new ShoppingCartPaymentPage(this.page);
    }

}