import { ApolloClient, InMemoryCache, createHttpLink  } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// HTTP connection to API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:3001/graphql',
});

// Middleware function that will retrieve the token and attach it to the request.
const authLink = setContext((_, { headers }) => {
    // retrieve the authentication token from local storage if it exists
    const token = localStorage.getItem('id_token');
    // Return the headers to the context so the httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Instantiate the Apollo client with the created httpLink and a new instance of an InMemoryCache
const client = new ApolloClient({
    // The authLink middleware is concatenated with the httpLink,
    // So every request will have the authorization header
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;