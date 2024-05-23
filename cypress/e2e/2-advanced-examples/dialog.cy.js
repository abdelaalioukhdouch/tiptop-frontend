/// <reference types="cypress" />

describe('Contact Form Page', () => {
    beforeEach(() => {
      // Visit the page where the contact form is rendered
      cy.visit('http://localhost:4200/participate'); // Replace '/contact' with the actual URL of your page
    });
  
    // it('should render the contact form', () => {
    //   // Check that the form and its elements are rendered
    //   cy.get('form#contactForm').should('exist');
    //   cy.get('input#code').should('exist');
    //   cy.get('input[value="Envoyer"]').should('exist');
    // });
  
    it('should display error message for invalid ticket number', () => {
      // Simulate entering an invalid ticket number and submitting the form
      cy.get('input#code').type('invalidcode');
      cy.get('input[value="Envoyer"]').click();
  
      // Check that the error message is displayed
      cy.get('small.text-danger').should('contain.text', 'Expected error message'); // Replace with the actual error message
    });
  
    it('should display success message and image for valid ticket number', () => {
      // Simulate entering a valid ticket number and submitting the form
      cy.get('input#code').type('validcode');
      cy.get('input[value="Envoyer"]').click();
  
      // Check that the success message and image are displayed
      cy.get('small.text-success').should('contain.text', 'Expected success message'); // Replace with the actual success message
      cy.get('img[src="../assets/img/congrats.png"]').should('be.visible');
    });
  
    it('should display spinner while waiting for response', () => {
      // Simulate entering a ticket number and submitting the form
      cy.get('input#code').type('validcode');
      cy.get('input[value="Envoyer"]').click();
  
      // Check that the spinner is displayed while waiting
      cy.get('div.submitting .spinner-border').should('be.visible');
    });
  
    it('should disable submit button and display participation message for valid ticket', () => {
      // Simulate entering a valid ticket number and submitting the form
      cy.get('input#code').type('validcode');
      cy.get('input[value="Envoyer"]').click();
  
      // Check that the submit button is disabled and participation message is displayed
      cy.get('input[value="Envoyer"]').should('be.disabled');
      cy.get('div.d-flex p').should('contain.text', 'Restez à l\'écoute, un grand tirage au sort déterminera bientôt le gagnant d\'un an de thé d\'une valeur de 360€. Bonne chance !');
      cy.get('button.btn-success').should('be.visible').and('not.be.disabled');
    });
  
    it('should participate in big prize and disable the button', () => {
      // Simulate entering a valid ticket number and submitting the form
      cy.get('input#code').type('validcode');
      cy.get('input[value="Envoyer"]').click();
  
      // Simulate clicking the participate button
      cy.get('button.btn-success').click();
  
      // Check that the participate button is disabled
      cy.get('button.btn-success').should('be.disabled');
    });
  });
  