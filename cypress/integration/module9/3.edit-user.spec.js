import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Kiểm tra chức năng cập nhật thông tin người dùng', () => {

    /*
    "- Đăng nhập quyền admin
- Chọn menu ""Quản lý người dùng""
- Bấm chọn nút ""Cập nhật"" ở cột ""Thao tác"" ở dòng thông tin người dùng có tên tài khoản ""test3""
- Bấm chọn giá trị ""ADMIN"" trong trường ""Phân quyền""
- Bấm chọn ""OK"""
----->
Hiển thị thông báo "Cập nhật thông tin người dùng thành công"
    */
    it('[Module9-6] Cập nhật thông tin người dùng hợp lệ', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="edit-user"]')
        .eq(-1)
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="roleId"]')
        .should('be.visible')
        .click({ force: true })

      cy.contains('ADMIN')
        .should('be.visible')
        .click({ force: true })

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Cập nhật người dùng thành công')
        .should('be.visible')
    })


    /*
    "- Đăng nhập quyền admin
- Chọn menu ""Quản lý người dùng""
- Bấm chọn nút ""Cập nhật"" ở cột ""Thao tác"" ở dòng thông tin người dùng có tên tài khoản ""test3""
- Nhập giá trị ""test-mail-update"" trong trường ""Email""
- Bấm chọn ""OK"""

->>>>

"- Hiển thị nhắc nhở ""Địa chỉ email không hợp lệ"" ở trường ""Email""
- Không thực hiện cập nhật người dùng"
    */

    it('[Module9-7] Cập nhật người dùng với thông tin không hợp lệ', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="edit-user"]')
        .eq(-1)
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="email"]')
        .should('be.visible')
        .clear()
        .type("test-mail-update", { delay: 50 })

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Địa chỉ email không hợp lệ!')
        .should('be.visible')
    })

    /*
    "- Đăng nhập quyền admin
    - Chọn menu ""Quản lý người dùng""
    - Bấm chọn nút ""Cập nhật"" ở cột ""Thao tác"" ở dòng thông tin người dùng có tên ""test3"""
    =>>>
    "Màn hình ""Cập nhật thông tin người dùng"" xuất hiện với các thông tin được điền sẵn:
    - ""test3"" trong trường ""Tên người dùng"" bị vô hiệu hoá phương thức nhập
    - ""Number Three"" trong trường ""Tên người dùng""
    - ""test3@gmail.com"" trong trường ""Email""
    - ""Thu ngân"" trong trường ""Phân quyền"""
    */
    it('[Module9-8] Hiển thị thông tin người dùng cần cập nhật ở màn hình "Cập nhật thông tin người dùng"', () => {
      cy.login('admin')
      cy.visit(link + '/users')
      cy.wait(setting.wait)
      cy.get('[name="edit-user"]')
        .eq(-1)
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="username"]')
        .should('be.visible')
        .should('be.disabled')
        .should('have.value', 'test3')

      cy.contains('ADMIN')
        .should('be.visible')
    })

  })
})
