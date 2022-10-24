import { gql } from "@apollo/client";

export const BOOKS = gql`
  query {
    books {
      id
      name
      genre
      author {
        id
        name
        age
      }
    }
  }
`;