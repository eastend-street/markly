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