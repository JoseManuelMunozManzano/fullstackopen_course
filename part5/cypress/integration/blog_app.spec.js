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

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'jmunoz', password: '123456' });
      });

      it('A blog can be created', function () {
        cy.contains('create new blog').click();
        cy.get('#title').type('Canonical string reduction');
        cy.get('#author').type('Edsger W. Dijkstra');
        cy.get('#url').type(
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
        );

        cy.get('#create-button').click();

        cy.contains(
          'a new blog Canonical string reduction by Edsger W. Dijkstra added'
        );
      });

      describe('and several blogs exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
          });

          cy.createBlog({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          });

          cy.createBlog({
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          });
        });

        it('User can like a blog', function () {
          cy.contains('First class tests')
            .parent()
            .find('button')
            .as('viewButton');
          cy.get('@viewButton').click();

          cy.get('.button-likes-jest').click();

          cy.contains('likes 1');
        });

        it('the user who created the blog can delete it', function () {
          cy.contains('First class tests')
            .parent()
            .find('button')
            .as('viewButton');
          cy.get('@viewButton').click();

          cy.get('#remove-button').click();
          cy.contains(
            'The blog First class tests by Robert C. Martin was removed'
          );
        });

        it('other users can not delete the blog', function () {
          const userTwo = {
            name: 'Adriana Perez',
            username: 'aperez',
            password: '123456',
          };
          cy.request('POST', 'http://localhost:3003/api/users', userTwo);
          cy.login({ username: 'aperez', password: '123456' });

          cy.contains('First class tests')
            .parent()
            .find('button')
            .as('viewButton');
          cy.get('@viewButton').click();

          cy.get('#remove-button').should('not.exist');
        });
      });
    });
  });
});
