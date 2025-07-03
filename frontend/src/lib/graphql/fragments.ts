// GraphQL fragments for colocation pattern

export const BOOKMARK_CORE_FRAGMENT = `
  fragment BookmarkCore on Bookmark {
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
`;

export const BOOKMARK_WITH_COLLECTION_FRAGMENT = `
  fragment BookmarkWithCollection on Bookmark {
    ...BookmarkCore
    collection {
      id
      name
      color
    }
  }
  ${BOOKMARK_CORE_FRAGMENT}
`;

export const COLLECTION_CORE_FRAGMENT = `
  fragment CollectionCore on Collection {
    id
    name
    description
    color
    userId
    createdAt
    updatedAt
  }
`;

export const COLLECTION_WITH_BOOKMARKS_FRAGMENT = `
  fragment CollectionWithBookmarks on Collection {
    ...CollectionCore
    bookmarks {
      ...BookmarkCore
    }
  }
  ${COLLECTION_CORE_FRAGMENT}
  ${BOOKMARK_CORE_FRAGMENT}
`;

export const USER_CORE_FRAGMENT = `
  fragment UserCore on User {
    id
    email
    username
    createdAt
    updatedAt
  }
`;