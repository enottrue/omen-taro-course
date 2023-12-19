import { gql } from 'graphql-request';

export const typeDefs = gql`
  type Tool {
    id: String
    name: String
    description: String
    link: String
    image: String
    updatedAt: String
    createdAt: String
  }

  type deleteResult {
    status: String
    message: String
    tool: Tool
  }

  type Query {
    getTools: [Tool!]!
    getId: String
    getTool(id: String!): Tool
    getUser(id: ID!): User
    getUsers: [User!]!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    password: String!
    city: String
    phone: String
    updatedAt: String
    createdAt: String
  }

  type AuthPayload {
    token: String
    user: User
    message: String
    error: String
  }

  type Mutation {
    addTool(
      name: String!
      link: String!
      description: String!
      image: String!
    ): Tool
    deleteTool(id: String!): deleteResult!
    updateTool(
      id: String!
      name: String
      link: String
      description: String
    ): Tool
    addUser(
      email: String!
      name: String!
      password: String!
      city: String
      phone: String
    ): User
    updateUser(
      id: ID!
      email: String
      name: String
      password: String
      city: String
      phone: String
    ): User
    deleteUser(id: ID!): User
    registerUser(
      email: String!
      password: String!
      name: String!
      phone: String
      city: String
    ): AuthPayload
    loginUser(email: String!, password: String!): AuthPayload
  }
`;
