import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Xóa phòng', () => {
    it('[Module5-12]	Xóa phòng thành công', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.get('[name="delete-room"]')
        .eq(-1)
        .click({ force: true })

      cy.wait(wait * 0.5)

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Xoá phòng hát thành công!')
        .should('be.visible')
    })


    it('[Module5-13]	Hủy  xóa phòng ', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.get('[name="delete-room"]')
        .eq(-1)
        .click({ force: true })

      cy.wait(wait * 0.5)

      cy.contains('Cancel')
        .should('be.visible')
        .click({ force: true })

      cy.contains('A.6')
        .should('be.visible')
    })
  })
})
