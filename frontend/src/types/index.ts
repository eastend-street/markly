export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  color?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  notes?: string;
  favicon?: string;
  screenshot?: string;
  tags: string[];
  collectionId: string;
  collection?: Collection;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkInput {
  title: string;
  url: string;
  description?: string;
  notes?: string;
  tags?: string[];
  collectionId: string;
}

export interface UpdateBookmarkInput {
  title?: string;
  url?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  collectionId?: string;
}

export interface BookmarkFilter {
  search?: string;
  tags?: string[];
  collectionId?: string;
  limit?: number;
  offset?: number;
}