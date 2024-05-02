import { browser, by, element } from 'protractor';

describe('Login Functionality', () => {
    it('should allow a user to log in and redirect to the home page', async () => {
        await browser.get('/login'); // Adjust this URL to where your login page is actually accessible in your app

        const emailField = element(by.css('input[type="email"]'));
        const passwordField = element(by.css('input[type="password"]'));
        const loginButton = element(by.css('button[type="submit"]')); // Update selector based on your actual button

        // Fill in the login form
        await emailField.sendKeys('test@example.com');
        await passwordField.sendKeys('password123'); // Use the correct selector and credentials

        // Click the login button
        await loginButton.click();

        // Check if the URL is the expected one after login
        expect(await browser.getCurrentUrl()).toContain('/home'); // Adjust '/home' based on your routing upon successful login

        // Optional: Check for a success message or user profile elements
        const successMessage = element(by.css('.success-message')); // Use the correct selector for your success message
        expect(await successMessage.isPresent()).toBeTrue();
    });
});
