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


export const GETReportRevenueRooms = gql`
 query ($startDate: Float!, $endDate: Float!){
  ReportRevenueRooms(startDate: $startDate, endDate: $endDate) {
    _id
    customer {
      _id
      name
    }
    createdAt
    createdBy {
      _id
      username
    }
    roomDetails {
      total
      room {
        _id
        name
      }
    }
    serviceDetails {
      total
    }
    state
    discount {
      name
      value
    }
    total
  }
}

`