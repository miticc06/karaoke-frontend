
import gql from 'graphql-tag'

export const GET_ROOMS = gql`
  query {
    rooms {
      _id
      name
      createdAt
      isActive
      typeRoom {
        _id
        name
        unitPrice
      }
    }
  }
`