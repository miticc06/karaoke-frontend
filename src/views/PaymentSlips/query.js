import gql from 'graphql-tag'

export const GET_PAYMENTSLIPS = gql`
  query {
    paymentSlips {
      _id
      description
      price
      createdAt
      createdBy {
        name
      }
    }
  }
`

export const GET_PAYMENTSLIP = gql`
  query ($paymentSlipId: String!) {
    paymentSlip(paymentSlipId: $paymentSlipId) {
      _id
      description
      price
      createdAt
      createdBy {
        name
      }
    }
  }
`

export const ADD_PAYMENTSLIP = gql`
  mutation ($input: PaymentSlipInput!){
    createPaymentSlip(input: $input) {
      _id
      description
      price
      createdAt
      createdBy {
        name
      }
    }
  }
`

export const UPDATE_PAYMENTSLIP = gql`
  mutation ($paymentSlipId: String!, $input: PaymentSlipInput!){
    updatePaymentSlip(paymentSlipId: $paymentSlipId,input: $input) {
      _id
      description
      price
      createdAt
      createdBy {
        name
      }
    }
  }
`

export const DELETE_PAYMENTSLIP = gql`
  mutation($paymentSlipId: String!) {
    deletePaymentSlip(paymentSlipId: $paymentSlipId)
  }
`