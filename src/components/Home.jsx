import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_LAMBDA_URL)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          setError("Invalid response format");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the to-dos!", error);
        setError("Error fetching to-dos");
      });
  }, []);

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-white text-3xl font-bold mb-4">To-Do List</h1>
      {todos.length === 0 ? (
        <p className="text-white">No to-dos available</p>
      ) : (
        <ul className="text-white list-disc pl-5">
          {todos.map((todo) => (
            <li key={todo.id} className="mb-2">
              {todo.task}
              {todo.attachment && (
                <img src={todo.attachment} alt="attachment" className="mt-2" />
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/add-todo">
        <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">
          Add To-Do
        </button>
      </Link>
    </div>
  );
}

export default Home;
