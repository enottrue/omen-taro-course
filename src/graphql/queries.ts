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
      onboarded
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
      onboarded
      createdAt
      updatedAt
    }
  }
`;

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
      onboarded
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
        onboarded
      }
      message
      error
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        city
        phone
        onboarded
      }
      message
      error
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
    $city: String
    $onboarded: Boolean
    $phone: String
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      onboarded: $onboarded
      city: $city
      phone: $phone
    ) {
      id
      name
      email
      city
      phone
      onboarded
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSES = gql`
  query GetCourses {
    getCourses {
      id
      name
      lessons {
        id
        lessonNumber
        lessonName
        lessonDescription
        lessonStages {
          id
          stageNumber
          stageName
          lessonId
        }
        lessonTimecodes
        lessonStatus
        courseId
        updatedAt
        createdAt
      }
      updatedAt
      createdAt
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      lessons {
        id
        lessonNumber
        lessonName
        lessonDescription
        lessonStages {
          id
          stageNumber
          stageName
          lessonId
        }
        lessonTimecodes
        lessonStatus
        courseId
        updatedAt
        createdAt
      }
      updatedAt
      createdAt
    }
  }
`;

export const GET_LESSON = gql`
  query getLesson($id: ID!) {
    getLesson(id: $id) {
      id
      lessonNumber
      lessonName
      lessonDescription
      lessonStages {
        id
        stageNumber
        stageName
        stageDescription
        stageTimecodes {
          id
          name
          timeCodeStart
          timeCodeEnd
        }
      }
      lessonTimecodes
      lessonStatus
      courseId
      updatedAt
      createdAt
    }
  }
`;

export const GET_LESSONS = gql`
  query getLessons {
    getLessons {
      id
      lessonNumber
      lessonName
      lessonDescription
      lessonStages {
        id
        stageNumber
        stageName
        stageDescription
        stageTimecodes {
          id
          name
          timeCodeStart
          timeCodeEnd
        }
      }
      lessonTimecodes
      lessonStatus
      courseId
      updatedAt
      createdAt
    }
  }
`;
