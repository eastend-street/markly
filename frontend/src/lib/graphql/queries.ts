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

export const GET_BOOKMARKS_QUERY = gql`
  query GetBookmarks($filter: BookmarkFilter, $limit: Int, $offset: Int) {
    bookmarks(filter: $filter, limit: $limit, offset: $offset) {
      id
      title
      url
      description
      notes
      favicon
      screenshot
      tags
      collectionId
      userId
      createdAt
      updatedAt
      collection {
        id
        name
        color
      }
    }
  }
`;

export const GET_BOOKMARK_QUERY = gql`
  query GetBookmark($id: ID!) {
    bookmark(id: $id) {
      id
      title
      url
      description
      notes
      favicon
      screenshot
      tags
      collectionId
      userId
      createdAt
      updatedAt
      collection {
        id
        name
        color
      }
    }
  }
`;

export const CREATE_BOOKMARK_MUTATION = gql`
  mutation CreateBookmark($input: CreateBookmarkInput!) {
    createBookmark(input: $input) {
      id
      title
      url
      description
      notes
      favicon
      screenshot
      tags
      collectionId
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOKMARK_MUTATION = gql`
  mutation UpdateBookmark($id: ID!, $input: UpdateBookmarkInput!) {
    updateBookmark(id: $id, input: $input) {
      id
      title
      url
      description
      notes
      favicon
      screenshot
      tags
      collectionId
      userId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BOOKMARK_MUTATION = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(id: $id)
  }
`;