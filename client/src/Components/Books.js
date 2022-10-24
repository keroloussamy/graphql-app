import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { BOOKS } from "../GraphQL/Queries";

function Books() {
  const { error, loading, data } = useQuery(BOOKS);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);

  return (
    <div>
      {books.map((book) => {
        return <h1 key={book.id}> {book.name}</h1>;
      })}
    </div>
  );
}

export default Books;