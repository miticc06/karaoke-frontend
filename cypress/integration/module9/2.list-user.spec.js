import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Kiểm tra danh sách người dùng', () => {
    /*
    - Có 5 cột "Tên tài khoản", "Tên người dùng", "Email", "Phân quyền", "Thao tác"
    */
    it('[Module9-3] Kiểm tra danh sách người dùng có đủ số cột', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.contains('Tên tài khoản')
        .should('be.visible')

      cy.contains('Email')
        .should('be.visible')

      cy.contains('Tên người dùng')
        .should('be.visible')

      cy.contains('Phân quyền')
        .should('be.visible')

      cy.contains('Thao tác')
        .should('be.visible')
    })


    it('[Module9-4]	Kiểm tra có tồn tại user "test3"', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.contains('test3')
        .should('be.visible')
    })
  })
})
