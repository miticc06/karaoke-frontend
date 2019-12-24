import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Kiểm tra thêm user mới', () => {

    it('[Module9-] Kiểm tra thêm user mới với thông tin để trống', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="btn-add-user"]')
        .should('be.visible')
        .click({ force: true })

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.get('.ant-form-explain')
        .should('be.visible')
    })


    /**
"- Đăng nhập quyền admin
- Chọn menu ""Quản lí người dùng""
- Chọn ""Thêm mới""
- Nhập tên tài khoản: ""test2""
- Mật khẩu: ""123""
- Tên người dùng ""Number One""
- Email: test2gmail.com
- Phân quyền: Thu ngân
- Bấm ""OK"""
    */
    it('[Module9-1] Kiểm tra thêm user mới với email sai định dạng', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="btn-add-user"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="username"]')
        .should('be.visible')
        .type("test2", { delay: 70 })

      cy.get('[id="password"]')
        .should('be.visible')
        .type("123", { delay: 70 })

      cy.get('[id="name"]')
        .should('be.visible')
        .type("Number One", { delay: 70 })

      cy.get('[id="email"]')
        .should('be.visible')
        .type("test2gmail.com", { delay: 70 })

      cy.get('[id="roleId"]')
        .should('be.visible')
        .click({ force: true })

      cy.contains('ADMIN')
        .should('be.visible')
        .click({ force: true })

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.get('.ant-form-explain')
        .should('be.visible')
    })

    /*
    
    "- Đăng nhập quyền admin
    - Chọn menu ""Quản lí người dùng""
    - Chọn ""Thêm mới""
    - Nhập tên tài khoản: ""test3""
    - Mật khẩu: ""123""
    - Tên người dùng ""Number Three""
    - Email: test3@gmail.com
    - Phân quyền: Thu ngân
    - Bấm ""OK"""
    */
    it('[Module9-1] Kiểm tra thêm user mới hợp lệ', () => {
      restoreDB('DB4')
      cy.wait(wait * 0.5)
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="btn-add-user"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="username"]')
        .should('be.visible')
        .type("test3", { delay: 70 })

      cy.get('[id="password"]')
        .should('be.visible')
        .type("123", { delay: 70 })

      cy.get('[id="name"]')
        .should('be.visible')
        .type("Number Three", { delay: 70 })

      cy.get('[id="email"]')
        .should('be.visible')
        .type("test3@gmail.com", { delay: 70 })

      cy.get('[id="roleId"]')
        .should('be.visible')
        .click({ force: true })

      cy.contains('CASHIER')
        .should('be.visible')
        .click({ force: true })

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Thêm người dùng thành công')
        .should('be.visible')
    })
  })
})
