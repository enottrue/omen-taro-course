import { gql } from '@apollo/client';
import { User } from '@prisma/client';

export const getAllTools = gql`
  query GetTools {
    getTools {
      id
      createdAt
      description
      image
      link
      name
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      city
      phone
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetAllUsers {
    getUsers {
      id
      name
      email
      city
      phone
      createdAt
      updatedAt
    }
  }
`;

//write mutation to addUser
export const ADD_USER = gql`
  mutation AddUser(
    $email: String!
    $name: String!
    $password: String!
    $city: String
    $phone: String
  ) {
    addUser(
      email: $email
      name: $name
      password: $password
      city: $city
      phone: $phone
    ) {
      id
      email
      name
      city
      phone
    }
  }
`;
export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $name: String!
    $password: String!
    $city: String
    $phone: String
  ) {
    registerUser(
      email: $email
      name: $name
      password: $password
      city: $city
      phone: $phone
    ) {
      token
      user {
        id
        email
        name
        city
        phone
      }
      message
      error
    }
  }
`;
