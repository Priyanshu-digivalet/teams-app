import { createRoot } from "react-dom/client";
import App from "./components/App";
// import "./components/assets/fonts/css/fonts.css";
import "./index.css";
import { amplifyConfig } from "./amplify-config";
import { Amplify } from "aws-amplify";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GRAPHQL_URI } from "./components/assets/constants/constants";
Amplify.configure(amplifyConfig);

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const idToken = localStorage.getItem(
    Object.keys(localStorage).find((key) => key.includes("idToken"))!
  )!;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: idToken
        ? `Bearer ${localStorage.getItem(
            Object.keys(localStorage).find((key) => key.includes("idToken"))!
          )!}`
        : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
