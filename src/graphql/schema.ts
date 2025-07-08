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
    getCourses: [Course]
    getCourse(id: ID!, userId: Int): Course
    getLesson(id: ID!): Lesson
    getLessons: [Lesson]
    getStageStatus(userId: Int!): [StageStatus]
 
  }

  type User {
    id: ID!
    email: String!
    name: String!
    password: String!
    city: String
    phone: String
    isPaid: Boolean
    bitrix24ContactId: Int
    bitrix24DealId: Int
    onboarded: Boolean
    updatedAt: String
    createdAt: String
  }

  type Course {
    id: ID!
    name: String!
    lessons: [Lesson]
    updatedAt: String
    createdAt: String
  }

  type Lesson {
    id: ID!
    lessonNumber: Int!
    lessonName: String
    lessonDescription: String
    lessonStages: [Stage]
    lessonTimecodes: [String]
    lessonStatus: String
    courseId: Int
    course: Course
    updatedAt: String
    createdAt: String
  }

  type Stage {
    id: ID!
    stageNumber: Int!
    stageName: String!
    stageDescription: String
    lessonId: Int
    lesson: Lesson
     stageStatuses: [StageStatus]
 
    stageTimecodes: [StageTimecode]
  }

  type StageTimecode {
    id: ID!
    name: String!
    timeCodeStart: String!
    timeCodeEnd: String!
    stageId: Int
    stage: Stage
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    id: ID
    onboarded: Boolean
    token: String
    user: User
    message: String
    error: String
  }

  type StageStatus {
    id: ID!
    stageId: Int!
    stage: Stage!
    userId: Int!
    user: User!
    status: String!
    createdAt: String!
    updatedAt: String!
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
      onboarded: Boolean
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
    addStageStatus(stageId: Int!, userId: Int!, status: String!): StageStatus
    changeStageStatus(stageId: Int!, userId: Int!, status: String!): StageStatus
  }
`;
