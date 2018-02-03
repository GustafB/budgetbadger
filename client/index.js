import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Splash from './components/pages/Splash.jsx';
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink, concat } from 'apollo-link'
import App from './components/pages/App.jsx'
import Cookies from 'universal-cookie';

const httpLink = new HttpLink({ uri: 'http://localhost:1337/graphql', withCredentials: true, credentials: 'same-origin' });


// const middlewareLink = setContext(() => ({
//   headers: { 
//     authorization: localStorage.getItem('token') || null,
//   }
// }));
// const link = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

document.addEventListener('DOMContentLoaded', () => {
  return (
    ReactDOM.render(
      <BrowserRouter>
        <ApolloProvider client={ client }>
          <App/>
        </ApolloProvider>
      </BrowserRouter>,
      document.getElementById('app')
    )
  )
})