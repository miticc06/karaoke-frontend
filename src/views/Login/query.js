import gql from 'graphql-tag'

export const MUTATE_LOGIN = gql`
mutation ($username: String!, $password: String!){
  login(username: $username, password: $password) {
    token
  }
}
`