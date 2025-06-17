import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Sample data for different types
const mockData = {
  tags: [
    { id: '1', name: 'Nature', type: 'tags' },
    { id: '2', name: 'Architecture', type: 'tags' },
    { id: '3', name: 'Wildlife', type: 'tags' },
    { id: '4', name: 'Landscape', type: 'tags' },
    { id: '5', name: 'Urban', type: 'tags' },
  ],
  persons: [
    { id: '1', name: 'John Doe', type: 'persons' },
    { id: '2', name: 'Jane Smith', type: 'persons' },
    { id: '3', name: 'Mike Johnson', type: 'persons' },
    { id: '4', name: 'Sarah Wilson', type: 'persons' },
    { id: '5', name: 'David Brown', type: 'persons' },
  ],
  locations: [
    { id: '1', name: 'New York', type: 'locations' },
    { id: '2', name: 'Los Angeles', type: 'locations' },
    { id: '3', name: 'Chicago', type: 'locations' },
    { id: '4', name: 'Miami', type: 'locations' },
    { id: '5', name: 'Seattle', type: 'locations' },
  ],
}

// GraphQL schema
const typeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    type: String!
  }

  type Query {
    getFilterOptions(type: String!): [Item!]!
  }
`

// Resolvers
const resolvers = {
  Query: {
    getFilterOptions: async (_, { type }) => {
      console.log(
        `🚀 Request received for type: ${type} at ${new Date().toISOString()}`,
      )

      // Simulate network delay (1-2 seconds)
      const delay = Math.random() * 1000 + 1000 // 1-2 seconds
      await new Promise((resolve) => setTimeout(resolve, delay))

      console.log(
        `✅ Response sent for type: ${type} after ${delay.toFixed(0)}ms delay`,
      )

      return mockData[type] || []
    },
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // Log all incoming requests
    console.log(
      `📝 GraphQL request: ${
        req.body?.query?.includes('getFilterOptions')
          ? 'getFilterOptions query'
          : 'other'
      }`,
    )
    return {}
  },
})

console.log(`🚀 Server ready at: ${url}`)
console.log(`📊 Available types: tags, persons, locations`)
