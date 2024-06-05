// /// <reference types="cypress" />

// describe('Home Page', () => {
//     beforeEach(() => {
//       // Visit the home page
//       cy.visit('https://tiptipfront.azurewebsites.net/'); // Replace with the actual URL of your home page
//     });
  
//     // it('should display the hero section correctly', () => {
//     //   // Check for hero section elements
//     //   cy.get('.section-hero').should('exist');
//     //   cy.get('.section-hero img').should('have.attr', 'src', './assets/img/teahome.png');
//     //   cy.get('.section-hero h1').should('contain.text', 'Venez participer au jeu concours de Thétiptop Test CI/CD');
//     //   cy.get('.section-hero p.lead').should('contain.text', 'en participant à notre jeu-concours 100% gagnants !');
//     // });
  
//     it('should display the timer correctly', () => {
//       // Check for the timer display
//       cy.get('.section-hero .display-4').should('exist');
//     });
  
//     it('should display the login button if user is not authenticated', () => {
//       // Check that the login button is visible if the user is not authenticated
//       cy.get('.section-hero .btn-wrapper a').should('be.visible').and('contain.text', 'Je participe');
//     });
  
//     it('should display the cards correctly', () => {
//       // Check that the cards are displayed
//       cy.get('.cards-wrapper .card-grid-space').should('have.length.at.least', 1);
  
//       // Check the content of the first card
//       cy.get('.cards-wrapper .card-grid-space').first().within(() => {
//         cy.get('.card').should('have.attr', 'style').and('include', 'url(\'../assets/img/images/teacard1.jpg\')');
//         cy.get('.card p').should('contain.text', "Coffret découverte d'une valeur de 69€");
//       });
  
//       // Check the content of the second card
//       cy.get('.cards-wrapper .card-grid-space').eq(1).within(() => {
//         cy.get('.card').should('have.attr', 'style').and('include', 'url(\'../assets/img/images/teacard2.jpg\')');
//         cy.get('.card p').should('contain.text', "Coffret découverte d'une valeur de 39€");
//       });
  
//       // Add more checks for other cards as needed
//     });
  
//     // Add more tests for other elements and interactions as needed
//   });
  