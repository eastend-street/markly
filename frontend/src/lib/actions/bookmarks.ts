'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { CreateBookmarkInput, UpdateBookmarkInput, BookmarkFilter, Bookmark } from '@/types';
import { BOOKMARK_CORE_FRAGMENT, BOOKMARK_WITH_COLLECTION_FRAGMENT } from '@/lib/graphql/fragments';

// For server actions, use internal Docker network URL or localhost for local dev
const GRAPHQL_URL = process.env.GRAPHQL_INTERNAL_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/graphql';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  
  // Note: Server actions use cookies, client components use localStorage
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

async function graphqlRequest(query: string, variables?: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables
    }),
    cache: 'no-store' // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

export async function createBookmark(input: CreateBookmarkInput) {
  try {
    const data = await graphqlRequest(`
      mutation CreateBookmark($input: CreateBookmarkInput!) {
        createBookmark(input: $input) {
          ...BookmarkCore
        }
      }
      ${BOOKMARK_CORE_FRAGMENT}
    `, { input });

    // Revalidate relevant paths
    revalidatePath('/bookmarks');
    revalidatePath('/dashboard');
    revalidatePath('/collections');
    
    return { success: true, data: data.createBookmark };
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateBookmark(id: string, input: UpdateBookmarkInput) {
  try {
    const data = await graphqlRequest(`
      mutation UpdateBookmark($id: ID!, $input: UpdateBookmarkInput!) {
        updateBookmark(id: $id, input: $input) {
          ...BookmarkCore
        }
      }
      ${BOOKMARK_CORE_FRAGMENT}
    `, { id, input });

    // Revalidate relevant paths
    revalidatePath('/bookmarks');
    revalidatePath('/dashboard');
    revalidatePath('/collections');
    
    return { success: true, data: data.updateBookmark };
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteBookmark(id: string) {
  try {
    const data = await graphqlRequest(`
      mutation DeleteBookmark($id: ID!) {
        deleteBookmark(id: $id)
      }
    `, { id });

    // Revalidate relevant paths
    revalidatePath('/bookmarks');
    revalidatePath('/dashboard');
    revalidatePath('/collections');
    
    return { success: true, data: data.deleteBookmark };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getBookmarks(filter?: BookmarkFilter): Promise<{ success: boolean; data?: Bookmark[]; error?: string }> {
  try {
    const data = await graphqlRequest(`
      query GetBookmarks($filter: BookmarkFilter, $limit: Int, $offset: Int) {
        bookmarks(filter: $filter, limit: $limit, offset: $offset) {
          ...BookmarkWithCollection
        }
      }
      ${BOOKMARK_WITH_COLLECTION_FRAGMENT}
    `, {
      filter: filter ? {
        search: filter.search,
        tags: filter.tags,
        collectionId: filter.collectionId
      } : null,
      limit: filter?.limit,
      offset: filter?.offset
    });

    return { success: true, data: data.bookmarks };
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getBookmark(id: string): Promise<{ success: boolean; data?: Bookmark; error?: string }> {
  try {
    const data = await graphqlRequest(`
      query GetBookmark($id: ID!) {
        bookmark(id: $id) {
          ...BookmarkWithCollection
        }
      }
      ${BOOKMARK_WITH_COLLECTION_FRAGMENT}
    `, { id });

    return { success: true, data: data.bookmark };
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Utility function to extract metadata from URL
export async function extractUrlMetadata(url: string) {
  try {
    // This is a simplified version - in production, you'd want a more robust solution
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Markly/1.0)' }
    });
    
    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
    
    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["\'][^"\']*icon[^"\']*["\'][^>]*href=["\']([^"\']+)["\'][^>]*>/i);
    let favicon = faviconMatch ? faviconMatch[1] : '/favicon.ico';
    
    // Make favicon URL absolute
    if (favicon.startsWith('/')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.host}${favicon}`;
    } else if (!favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.host}/${favicon}`;
    }
    
    return {
      title,
      description,
      favicon
    };
  } catch (error) {
    console.error('Error extracting URL metadata:', error);
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: '',
      favicon: `${urlObj.protocol}//${urlObj.host}/favicon.ico`
    };
  }
}