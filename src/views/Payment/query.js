
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
      bill {
        _id
      }
      tickets {
        _id
        subject
        status
        createdAt
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
      dateOfBirth
      phone
      email
      points
      createdAt
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
export const SEARCH_CUSTOMERS = gql`
query ($text:String) {
  searchCustomers(text: $text) {
    _id
    name
    dateOfBirth
    phone
    email
    points
  }
}
`

export const GET_DISCOUNTS = gql`
query {
  discounts {
    _id
    name
    type
    value
    createdAt
    createdBy {
      _id
      username
      email
      name
    }
    startDate
    endDate
  }
}
`

export const UPDATE_CUSTOMER = gql`
mutation ($id: String!,$input: CustomerInput!){
  updateCustomer(id: $id, input:$input) {
    _id
  }
}
`