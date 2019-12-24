import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Thêm phòng', () => {
    /*
    "- Đăng nhập quyền admin 
    - Chọn menu ""Quản lí phòng hát"" 
    - Chọn ""Thêm mới""
    - Nhập Tên phòng hát=""roomname_test"", Loại Phòng chọn trong selection box có sẵn=""Phòng VIP| 100,000 VND/hour"" 
    - Bấm OK"
    
    =>>>
    Thông báo thêm mới phòng thành công. Phòng vừa thêm hiển thị với thông tin tương ứng trên danh sách phòng. 
    */
    it('[Module5-] Thêm phòng hợp lệ', () => {
      restoreDB('DB4')
      cy.wait(wait)
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)
      cy.get('[id="btn-add-room"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="name"]')
        .should('be.visible')
        .type("roomname_test", { delay: 50 })

      cy.get('[id="typeRoom"]')
        .should('be.visible')
        .click({ force: true })
        .type("{downarrow}{enter}}", { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Thêm phòng hát thành công!')
        .should('be.visible')
    })

    /*
    "- Đăng nhập quyền admin 
- Chọn menu ""Quản lí phòng hát"" 
- Chọn ""Thêm mới""
- Nhập Tên phòng hát="""", Loại Phòng chọn trong selection box có sẵn
- Bấm OK"

=>>>
Thông báo không được để tên phòng rỗng
    */
    it('[Module5-1] Thêm phòng không hợp lệ', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)
      cy.get('[id="btn-add-room"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="typeRoom"]')
        .should('be.visible')
        .click({ force: true })
        .type("{downarrow}{enter}}", { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Hãy nhập tên phòng hát!')
        .should('be.visible')
    })


    /*
    "- Đăng nhập quyền admin 
- Chọn menu ""Quản lí phòng hát"" 
- Chọn ""Thêm mới""
- Nhập Tên phòng hát=""roomname_test"", Loại Phòng chọn trong selection box có sẵn=""Phòng thường| 70,000 VND/hour"" 
- Bấm OK"
=>>
Thông báo tên phòng đã bị trùng. phòng hát nhập tên khác
*/
    it('[Module5-] Thêm phòng hợp lệ', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)
      cy.get('[id="btn-add-room"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="name"]')
        .should('be.visible')
        .type("roomname_test", { delay: 50 })

      cy.get('[id="typeRoom"]')
        .should('be.visible')
        .click({ force: true })
        .type("{downarrow}{enter}}", { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Name room đã được sử dụng!')
        .should('be.visible')
    })

    /*
    "- Đăng nhập quyền admin 
    - Chọn menu ""Quản lí phòng hát"" 
    - Chọn ""Thêm mới""
    - Nhập Tên phòng hát=""roomname_test"", Loại Phòng chọn trong selection box có sẵn=""Phòng thường| 70,000 VND/hour"" 
    - Bấm Cancel"
    => 
    Danh sách phòng vẫn không thay đổi.
    */
    it('[Module5-3]	Hủy thêm phòng', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)
      cy.get('[id="btn-add-room"]')
        .should('be.visible')
        .click({ force: true })

      cy.get('[id="name"]')
        .should('be.visible')
        .type("roomname_test", { delay: 50 })

      cy.get('[id="typeRoom"]')
        .should('be.visible')
        .click({ force: true })
        .type("{downarrow}{enter}}", { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('Cancel')
        .should('be.visible')
        .click({ force: true })

      cy.get('[name="edit-room"]')
        .its('length').should('eq', 9)
    })



  })
})
