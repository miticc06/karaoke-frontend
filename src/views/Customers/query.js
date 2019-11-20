import gql from 'graphql-tag'

export const GET_CUSTOMERS = gql`
  query {
    customers {
      _id
      name
      email
      phone
      createdAt
      points
      dateOfBirth
    }
  }
`

export const GET_CUSTOMER = gql`
  query ($id: ID!) {
    customer(id: $id) {
      _id
      name
      email
      phone
      createdAt
      points
      dateOfBirth
    }
  }
`

export const ADD_CUSTOMER = gql`
  mutation ($input: CustomerInput!){
    createCustomer(input: $input) {
      _id
      name
      email
      phone
      createdAt
      points
      }
    }
`

export const UPDATE_CUSTOMER = gql`
  mutation ($id: String!, $input: CustomerInput!){
    updateCustomer(id: $id,input: $input){
      _id
      name
      email
      phone
      createdAt
      points
      dateOfBirth
      }
  }
`

export const DELETE_CUSTOMER = gql`
  mutation($id: String!) {
    deleteCustomer(customerId: $id){
      _id
      name
      email
      phone
      createdAt
      points
      dateOfBirth
      }
  }
`
