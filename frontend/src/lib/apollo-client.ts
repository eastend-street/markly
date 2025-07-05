import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Determine the GraphQL endpoint based on environment
const getGraphQLUri = () => {
  if (typeof window === 'undefined') {
    // Server-side: use internal URL
    return process.env.INTERNAL_GRAPHQL_URL || 'http://localhost:8081/graphql';
  }
  
  // Client-side: use public URL
  const publicUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (publicUrl) {
    return publicUrl;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8081/graphql';
  }
  
  // Production fallback (should be set via environment variable)
  return 'https://api.markly.app/graphql';
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: 'same-origin', // Important for security
});

// Enhanced auth link with better token handling
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Validate token expiry (basic check)
  if (token && typeof window !== 'undefined') {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token expired, remove it
        localStorage.removeItem('token');
        window.location.href = '/auth';
        return { headers };
      }
    } catch (error) {
      // Invalid token format, remove it
      localStorage.removeItem('token');
      console.warn('Invalid token format, removing token');
    }
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors
      if (message.includes('not authenticated') || message.includes('token')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Handle 401 Unauthorized
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          bookmarks: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
          collections: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // Security: Don't send credentials to different origins
  credentials: 'same-origin',
});