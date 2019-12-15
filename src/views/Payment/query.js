
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

export const GET_BILL_BY_ROOM_ID = gql`
 query ($roomId: ID!) {
  billByRoom(roomId: $roomId) {
    _id
    customer {
      _id
      name
    }
    state
    total
    roomDetails {
      room {
        _id
        name
        typeRoom {
          _id
          name
          unitPrice
          updatedAt
        }
      }
      startTime
      endTime
      total
    }
    serviceDetails {
      service {
        _id
        name
        type
        unitPrice
      }
      startTime
      endTime
      quantity
      total
    }
    createdAt
    createdBy {
      _id
      username
      role {
        _id
        code
        name
      }
    }
  }
}

`
