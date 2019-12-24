import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Cập nhật phòng', () => {
    /*
"- Đăng nhập quyền admin 
- Chọn menu ""Quản lí phòng hát"" 
- Nhấn nút cập nhật của phòng có tên phòng ""roomname_test""
- Loại Phòng chọn trong selection box có sẵn=""Phòng thường| 70,000 VND/hour"" 
- Bấm OK"
    
    =>>>
Thông báo cập nhật phòng thành công. Phòng vừa cập nhật hiển thị với thông tin tương ứng trên danh sách phòng.     */
    it('[Module5-5]	Cập nhật phòng hợp lệ', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.get('[name="edit-room"]')
        .eq(-1)
        .click({ force: true })

      cy.get('[id="typeRoom"]')
        .should('be.visible')
        .click({ force: true })
        .type("{downarrow}{enter}}", { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('OK')
        .should('be.visible')
        .click({ force: true })

      cy.contains('Cập nhật thông tin phòng hát thành công!')
        .should('be.visible')
    })

    /*
    
    "- Đăng nhập quyền admin 
- Chọn menu ""Quản lí phòng hát"" 
- Nhấn nút cập nhật của phòng có tên phòng ""roomname_test""
- Nhập Tên phòng hát=""""
- Loại Phòng chọn trong selection box có sẵn=""Phòng thường| 70,000 VND/hour"" 
- Bấm OK"

=>>>
Thông báo hãy nhập tên phòng hát
*/
    it('[Module5-6]	Cập nhật phòng không hợp lệ', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.get('[name="edit-room"]')
        .eq(-1)
        .click({ force: true })

      cy.get('[id="name"]')
        .should('be.visible')
        .clear()

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
- Nhấn nút cập nhật của phòng có tên phòng ""roomname_test""
- Nhập Tên phòng hát=""roomname_test_change""
- Bấm Cancel"
=>>
Tên phòng vẫn không thay đổi
   */
    it('[Module5-7]	Huỷ cập nhật phòng', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.get('[name="edit-room"]')
        .eq(-1)
        .click({ force: true })

      cy.get('[id="name"]')
        .should('be.visible')
        .clear()
        .type('room_test_change', { delay: 50 })

      cy.wait(wait * 0.5)

      cy.contains('Cancel')
        .should('be.visible')
        .click({ force: true })

      cy.contains('roomname_test')
        .should('be.visible')
    })
  })
})
