import setting from '../../../cypress.json'

const { wait, usernameAdmin, passwordAdmin } = setting
const link = Cypress.env('FRONTEND')

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Test function login', () => {
    it('Visit website test', () => {
      cy.visit(link)
      cy.wait(setting.wait)
    })

    it('Login', () => {
      cy.get('[name="username"]')
        .should('be.visible')
        .type(usernameAdmin, { delay: 150 })

      expect(passwordAdmin).to.have.ownProperty(0)

      cy.get('[name="password"]')
        .should('be.visible')
        .type(passwordAdmin, { delay: 200 })

      cy.wait(wait)
      expect(passwordAdmin).to.have.ownProperty(length)

      cy.get('button[type="submit"]')
        .should('be.visible')
        .click({ force: true })

      cy.wait(wait)
    })

    it('Login success', () => {
      cy.contains('Đăng nhập thành công!')
        .should('be.visible')
    });
  })
})
