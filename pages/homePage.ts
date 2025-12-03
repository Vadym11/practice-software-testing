import { Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { Header } from "./headerCommon";

export class HomePage extends BasePage{

    public readonly header: Header;

    constructor(page: Page) {
        super(page);
        this.header = new Header(page);
    }

    async goTo(): Promise<HomePage> {
        await this.page.goto('/');

        return this;
    }
}