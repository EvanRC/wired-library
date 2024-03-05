import { ApolloClient, InMemoryCache, createHttpLink  } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// HTTP connection to API
const httpLink = createHttpLink