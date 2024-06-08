import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/todos")
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
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-white text-3xl font-bold">To-Do List</h1>
      <ul className="text-white">
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.task}
            {todo.attachment && <img src={todo.attachment} alt="attachment" />}
          </li>
        ))}
      </ul>
      <Link to="/add-todo">
        <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">
          Add To-Do
        </button>
      </Link>
    </div>
  );
}

export default Home;
