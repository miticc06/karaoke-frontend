// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (type) => {
  switch (type) {
    case 'admin':
      window.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MmRkYzQ2ZS04ODYzLTRmM2MtYTg0YS00MWMyZjRlY2QzYTAiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTc2NDI1MDY3fQ.9xNYbfVkZDW445tXRiKBjJ3aqDPJZXENj73acf2LjBg')
      break
    default: break
  }
})
