
import gql from 'graphql-tag'

export const GET_BILLS = gql`
  query {
    bills {
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

export const GET_BILL = gql`
  query ($id: ID!) {
    bill(id: $id) {
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

export const UPDATE_BILL = gql`
  mutation ($billId: String!, $input: BillInput!){
    updateBill(billId: $billId, input: $input){
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
  }}
`

export const DELETE_BILL = gql`
  mutation($billId: String!) {
    deleteBill(billId: $billId)
  }
`
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