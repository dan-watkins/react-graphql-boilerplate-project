import { Outlet } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client/core";
import { StoreProvider } from "./utils/store-context";
import "./App.scss";
import Auth from "./utils/auth";

const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = Auth.getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <div id="app-shell">
          <Nav />
          {Auth.loggedIn() ? <Outlet /> : <Login />}
        </div>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
