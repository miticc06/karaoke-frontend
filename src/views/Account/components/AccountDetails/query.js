import gql from 'graphql-tag'

export const MUTATE_UPDATE_USER = gql`
  mutation ($userId: String!, $input: UserUpdateInput!){
    updateUser(userId: $userId,input: $input)
  }
`