import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_LAMBDA_URL_GET)
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

  const handleEdit = (id) => {
    navigate(`/edit-todo/${id}`);
  };

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-white text-3xl font-bold mb-4">To-Do List</h1>
      {todos.length === 0 ? (
        <p className="text-white">No to-dos available</p>
      ) : (
        <ul className="text-white font-medium list-disc pl-5 space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border border-white p-4 rounded shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <span>{todo.task}</span>
                  {todo.attachment && (
                    <img
                      src={todo.attachment}
                      alt="attachment"
                      className="mt-2"
                    />
                  )}
                </div>
                <button
                  onClick={() => handleEdit(todo.id)}
                  className="mt-2 sm:mt-0 sm:ml-4 px-2 py-1 bg-green-700 text-white rounded"
                >
                  Edit
                </button>
              </div>
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
