/* eslint-disable linebreak-style */
import gql from 'graphql-tag'

export const GET_DISCOUNTS = gql`
  query {
    discounts {
      _id
      name
      type
      value
      createdAt
      createdBy{
        _id
        name
      }
      startDate
      endDate
      isActive
     
    }
  }
`

export const GET_DISCOUNT = gql`
  query ($discountId: String!) {
    discount(discountId: $discountId) {
      _id
      name
      type
      value
      createdAt
      startDate
      endDate
      isActive
    }
  }
`

export const ADD_DISCOUNT = gql`
  mutation ($input: DiscountInput!){
    createDiscount(input: $input) {
      _id
      name
      type
      value
      createdAt
      createdBy{
        _id
        name
      }
      startDate
      endDate
      isActive
    }
    }
`

export const UPDATE_DISCOUNT = gql`
  mutation ($discountId: String!, $input: DiscountInput!){
    updateDiscount(discountId: $discountId,input: $input){
      _id
      name
      type
      value
      createdAt
      startDate
      endDate
      isActive
  }}
`

export const DELETE_DISCOUNT = gql`
  mutation($discountId: String!) {
    deleteDiscount(discountId: $discountId)
  }
`
