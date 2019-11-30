/* eslint-disable linebreak-style */
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

export const GET_ROOM = gql`
  query($roomId: String!) {
    room(roomId: $roomId) {
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

export const ADD_ROOM = gql`
  mutation($input: RoomInput!) {
    createRoom(input: $input) {
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

export const UPDATE_ROOM = gql`
  mutation($roomId: String!, $input: RoomInput!) {
    updateRoom(roomId: $roomId, input: $input) {
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

export const DELETE_ROOM = gql`
  mutation($roomId: String!) {
    deleteRoom(roomId: $roomId)
  }
`

export const GET_TYPES = gql`
  query {
    typerooms {
      _id
      name
      unitPrice
    }
  }
`
