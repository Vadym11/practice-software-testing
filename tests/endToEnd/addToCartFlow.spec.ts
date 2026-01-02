import test, { expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { User } from "../../types/user";
import { generateRandomuserData } from "../../test-utils/test-utils";
const connection = require('../../test-utils/mysqldb');

test.describe('Add to cart flow', () => {
    let newUser: User;
    const currentYear = new Date().getFullYear();
    
    test.beforeAll('Generate and register new user', async ({request, baseURL}) => {
        newUser = generateRandomuserData();

        console.log(newUser.email);
        console.log(newUser.password);
        
        const response_ = await request.post(`${baseURL}/api/users/login`, {
            data: {
                "email": "admin@practicesoftwaretesting.com",
                "password": "welcome01"
            }
        })

        const responseObject_ = await response_.json();

        console.log(response_.status());

        expect(response_.status()).toBe(200);

        const token = responseObject_.access_token;

        const response = await request.post(`${baseURL}/api/users/register`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: newUser
        })

        const responseObject = await response.json();

        console.log(response.status());

        expect(response.status()).toBe(201);

        const [rows] = await connection.execute('SELECT * FROM users ORDER BY updated_at DESC LIMIT 1;');
        const newUser_ = rows[0];

        expect(newUser_.first_name).toBe(newUser.first_name);
        expect(newUser_.last_name).toBe(newUser.last_name);
        expect(newUser_.email).toBe(newUser.email);
    })
    
    test('Add to cart (signed in user)', async({page}) => {

        const homePage = await new HomePage(page).goTo();
        
        await homePage.header.clickSignInLink();

        await new LoginPage(page)
            .loginSuccess(newUser.email, newUser.password);

        await homePage.header.clickMainBanner();
        
        const productPage = await homePage.clickFirstProduct();

        await productPage.clickAddToCart();

        await expect(productPage.getAddedToCartPopUp()).toBeVisible();

        await productPage.header.clickCartIcon();

        const shoppingCartMainPage = await productPage.header.clickCartIcon();

        const shoppingCartLoginPage = await shoppingCartMainPage.clickProceedToCheckout();

        const shoppingCartBillingPage = await shoppingCartLoginPage.clickProceedToCheckout();

        const billingDetailsFields = await shoppingCartBillingPage.getBillingAddresInputFields();

        const userBillingData = [
            newUser.address.street,
            newUser.address.city,
            newUser.address.state,
            newUser.address.postal_code
        ];

        billingDetailsFields.forEach(async (field) => {
            expect(userBillingData.includes(field)).toBeTruthy();
        })

        const shoppingCartPaymentPage = await shoppingCartBillingPage.clickProceedToCheckout();

        await shoppingCartPaymentPage.openPaymentMethodsDropdownMenu();
        await shoppingCartPaymentPage.selectCashOnDeliveryOption();
        await shoppingCartPaymentPage.clickConfirmButton();

        await expect(shoppingCartPaymentPage.getPaymentSuccessMessage())
            .toHaveText('Payment was successful');

        await shoppingCartPaymentPage.clickConfirmButton();

        await expect(shoppingCartPaymentPage.getInvoiceMessage())
            .toContainText(`Thanks for your order! Your invoice number is INV-${currentYear}`);
    })
});