describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    const user = {
      name: 'José Manuel Muñoz Manzano',
      username: 'jmunoz',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);

    cy.visit('http://localhost:3000');
  });

  it('login form is shown', function () {
    cy.contains('log in').click();
  });

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('jmunoz');
      cy.get('#password').type('123456');
      cy.get('#login-button').click();

      cy.contains('José Manuel Muñoz Manzano logged-in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('jmunoz');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
});
