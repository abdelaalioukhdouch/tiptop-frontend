describe('Login Test', () => {
    it('Successfully logs in', () => {
      cy.visit('/login'); // Adjust the URL to your application's login page
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('testpassword');
      cy.get('form').submit();
      cy.url().should('include', '/dashboard'); // Check if the URL is correct after login
      cy.get('.welcome-message').should('contain', 'Welcome, testuser'); // Verify welcome message
    });
  });
  