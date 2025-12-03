import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class MyAccountPage extends BasePage{

    readonly myAccountTitle: Locator;
    
    constructor(page: Page) {
        super(page);
        this.myAccountTitle = page.getByTestId('page-title');
    }
}