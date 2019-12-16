
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

export const CREATE_BILL = gql`
  mutation ($input: BillInput!){
  createBill(input: $input) {
    _id
  }
}
`

export const UPDATE_BILL = gql`
  mutation ($billId: String!, $input: BillInput!){
  updateBill(
    billId: $billId,
    input: $input 
  ) {
    _id
    # customer {
    #   _id
    #   name
    # }
    # state
    # total
    # roomDetails {
    #   room {
    #     _id
    #     name
    #     typeRoom {
    #       _id
    #       name
    #       unitPrice
    #     }
    #   }
    #   startTime
    #   endTime
    #   total
    # }
    # serviceDetails {
    #   service {
    #     _id
    #     name
    #     type
    #     unitPrice
    #   }
    #   startTime
    #   endTime
    #   quantity
    #   total
    # }
    # createdAt
    # createdBy {
    #   _id
    #   username
    #   role {
    #     _id
    #     code
    #     name
    #   }
    # }
  }
}
`


export const GET_SERVICES = gql`
query {
  services {
    _id
    name
    type
    unitPrice
  }
}
`