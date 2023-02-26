describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      "username": "testi",
      "name": "TesterMaster",
      "password": "salainenSana"
    })
    cy.request('POST', 'http://localhost:3003/api/users', {
      "username": "testi2",
      "name": "TesterMaster2",
      "password": "salainenSana2"
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
      cy.contains('TesterMaster logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('TheEevilHaxorManB)')
      cy.get('#password').type('HäxAllDay')
      cy.get('#login-button').click()
      cy.get('.error').contains('incorrect username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('testTitle')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('testUrl')
      cy.get('#create-button').click()
      cy.get('.notification').contains('a new blog testTitle by testAuthor added')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('testTitle')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('testUrl')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })
  })
  describe('Removing a blog', function() {
    beforeEach(function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
      cy.contains('new blog').click()
      cy.get('#title').type('testTitle')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('testUrl')
      cy.get('#create-button').click()
    })

    it('is possible for the correct user', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('.notification').contains('blog testTitle was removed')
    })

    it('isnt possible for incorrect user', function() {
      cy.contains('logout').click()
      cy.get('#username').type('testi2')
      cy.get('#password').type('salainenSana2')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.get('.blog').should('not.contain', 'remove')
    })
  })
})