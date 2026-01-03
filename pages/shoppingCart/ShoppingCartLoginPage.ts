import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ShoppingCartBillingPage } from "./ShoppingCartBillingPage";

export class ShoppingCartLoginPage extends BasePage {

    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.getByRole('button', {name: 'Proceed to checkout'});
    }

    async clickProceedToCheckout(): Promise<ShoppingCartBillingPage> {

        await this.proceedToCheckoutButton.click();

        return new ShoppingCartBillingPage(this.page);
    } 
}