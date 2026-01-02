import { Locator, Page } from "@playwright/test";
import { ShoppingCartMainPage } from "./shoppingCart/ShoppingCartMainPage";
export class HeaderCommon {

    private readonly page: Page;
    private readonly mainBanner: Locator;
    private readonly signInLinkk: Locator;
    private readonly cartIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainBanner = this.page.getByTitle('Practice Software Testing - Toolshop');
        this.signInLinkk = this.page.getByTestId('nav-sign-in');
        this.cartIcon = this.page.getByTestId('nav-cart');
    }

    async clickMainBanner(): Promise<void> {

        await this.mainBanner.click();
    }

    async clickSignInLink(): Promise<void> {

        await this.signInLinkk.click();
    }

    async clickUserNavMenu() {
        await this.page.getByTestId('nav-menu').click();

        return this
    }

    async clickSignOut() {

        await this.page.getByTestId('nav-sign-out').click();
    }

    async signOut() {
        await this.clickUserNavMenu();
        await this.clickSignOut();

        return this;
    }

    async clickCartIcon(): Promise<ShoppingCartMainPage> {
        await this.cartIcon.click();

        return new ShoppingCartMainPage(this.page);
    }
}