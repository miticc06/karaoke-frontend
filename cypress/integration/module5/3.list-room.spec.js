import setting from '../../../cypress.json'

const { wait } = setting
const link = Cypress.env('FRONTEND')

const restoreDB = async label => await cy.request('POST', Cypress.env('BACKEND'), { query: `mutation { restoreDB(label: "${label}") }` });

describe('viewport', () => {
  beforeEach(() => {
    cy.viewport(setting.viewportWidth, setting.viewportHeight)
  })

  describe('Kiểm tra danh sách phòng', () => {
    it('[Module5-9]	Kiểm tra danh sách phòng có đủ số cột', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)
      cy.contains('Tên phòng')
        .should('be.visible')

      cy.contains('Ngày tạo')
        .should('be.visible')

      cy.contains('Loại phòng')
        .should('be.visible')

      cy.contains('Đơn giá theo giờ')
        .should('be.visible')

      cy.contains('Thao tác')
        .should('be.visible')
    })

    it('[Module5-10]	Kiểm tra tồn tại phòng có tên phòng="roomname_test"', () => {
      cy.login('admin')
      cy.wait(wait)
      cy.visit(link + '/rooms')
      cy.wait(wait)

      cy.contains('roomname_test')
        .should('be.visible')

    })


  })
})
