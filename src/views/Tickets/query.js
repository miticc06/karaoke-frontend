import gql from 'graphql-tag'

export const GET_TICKETS = gql`
  query {
    tickets {
      _id
      subject
      status
      createdAt
      createdBy {
        name
      }
      room {
        _id
        name
      }
    }
  }
`

export const GET_TICKET = gql`
  query ($ticketId: String!) {
    ticket(ticketId: $ticketId) {
      _id
      subject
      status
      createdAt
      createdBy {
        name
      }
      room {
        _id
        name
      }
    }
  }
`

export const ADD_TICKET = gql`
  mutation ($input: TicketInput!){
    createTicket(input: $input) {
      _id
      subject
      status
      createdAt
      createdBy {
        name
      }
      room {
        _id
        name
      }
    }
  }
`

export const UPDATE_TICKET = gql`
  mutation ($ticketId: String!, $input: TicketInput!){
    updateTicket(ticketId: $ticketId,input: $input) {
      _id
      subject
      status
      createdAt
      createdBy {
        name
      }
      room {
        _id
        name
      }
    }
  }
`

export const DELETE_TICKET = gql`
  mutation($ticketId: String!) {
    deleteTicket(ticketId: $ticketId)
  }
`

export const GET_ROOMS = gql`
  query {
    rooms {
      _id
      name
    }
  }
`