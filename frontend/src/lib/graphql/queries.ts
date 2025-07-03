import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
      createdAt
      updatedAt
    }
  }
`;

export const GET_COLLECTIONS_QUERY = gql`
  query GetCollections {
    collections {
      id
      name
      description
      color
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_COLLECTION_QUERY = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      id
      name
      description
      color
      userId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COLLECTION_MUTATION = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      description
      color
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COLLECTION_MUTATION = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      name
      description
      color
      userId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COLLECTION_MUTATION = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;