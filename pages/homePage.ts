import { Page } from "@playwright/test";
import { BasePage } from "./BasePage.ts";
import { HeaderCommon } from "./HeaderCommon.ts";

export class HomePage extends BasePage{

    public readonly header: HeaderCommon;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderCommon(page);
    }

    async goTo(): Promise<HomePage> {
        await this.page.goto('/');

        return this;
    }
}