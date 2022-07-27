before('Authenticate', () => {
  cy.request('POST', '/', {
    password: Cypress.env('STAGING_PASSWORD'),
  });
});

describe('Dashboard', () => {
  it('Connects with Metamask', () => {
    cy.visit('/');
    cy.contains('Connect').click();
    cy.contains('MetaMask').click();

    cy.switchToMetamaskWindow();
    cy.acceptMetamaskAccess().should('be.true');

    cy.switchToCypressWindow();
  });
});
