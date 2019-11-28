import gql from 'graphql-tag'

export const GET_USERS = gql`
  query {
    users {
      _id
      username
      email
      name
      createdAt
      isActive
      role {
        _id
        code
        name
      }
    }
  }
`

export const GET_USER = gql`
  query ($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      name
      role {
        _id
        code
        name
      }
      
    }
  }
`

export const ADD_USER = gql`
  mutation ($input: UserCreateInput!){
    createUser(input: $input) {
      _id
      username
      email
      name
      createdAt
      isActive
      role {
        _id
        code
        name
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation ($userId: String!, $input: UserUpdateInputByAdmin!){
    updateUserByAdmin(userId: $userId,input: $input)
  }
`

export const DELETE_USER = gql`
  mutation($userId: String!) {
    deleteUser(userId: $userId)
  }
`

export const GET_ROLES = gql`
  query {
    roles {
      _id
      code
      name
      permissions {
        _id
        code
        name
      }
    }
  }
`
