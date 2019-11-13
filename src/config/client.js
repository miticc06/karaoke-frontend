import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'

const fetch = require('node-fetch')

console.log('process.env.PUBLIC_URL0', process.env)

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_BACKEND || 'http://dev1.kienthuc24h.com:2000/graphql',
  fetch
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      token: localStorage.getItem('token') ? `${localStorage.getItem('token')}` : ``
    }
  }))
  return forward(operation)
})
const link = split(
  ({ query }) => {
    const { kind } = getMainDefinition(query)
    return kind === 'OperationDefinition'
  }, httpLink
)
const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    mutate: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  }
})

export { client }
