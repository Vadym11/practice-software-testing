import { Locator, Page } from "@playwright/test";
import { HomePage } from "./homePage";
import { LoginPage } from "./loginPage";

export class Header {

    private readonly page: Page;
    private readonly mainBanner: Locator;
    private readonly signInLinkk: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainBanner = this.page.getByTitle('Practice Software Testing - Toolshop');
        this.signInLinkk = this.page.getByTestId('nav-sign-in');
    }

    async clickMainBanner(): Promise<void> {

        await this.mainBanner.click();
    }

    async clickSignInLink(): Promise<void> {

        await this.signInLinkk.click();
    }
}