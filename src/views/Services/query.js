/* eslint-disable linebreak-style */
import gql from 'graphql-tag'

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

export const GET_SERVICE = gql`
  query ($serviceId: String!) {
    service(serviceId: $serviceId) {
      _id
      name
      type
      unitPrice
    }
  }
`

export const ADD_SERVICE = gql`
  mutation ($input: ServiceInput!){
    createService(input: $input) {
      _id
      name
      type
      unitPrice
    }
    }
`

export const UPDATE_SERVICE = gql`
  mutation ($serviceId: String!, $input: ServiceInput!){
    updateService(serviceId: $serviceId,input: $input){
      _id
      name
      type
      unitPrice
  }}
`

export const DELETE_SERVICE = gql`
  mutation($serviceId: String!) {
    deleteService(serviceId: $serviceId)
  }
`
