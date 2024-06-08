import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  const fetchTodos = (date) => {
    const url = date
      ? import.meta.env.VITE_LAMBDA_URL_LIST_BY_DATE
      : import.meta.env.VITE_LAMBDA_URL_GET;
    const params = date ? { date: date } : {};

    axios
      .get(url, { params })
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
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchTodos(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleEdit = (id) => {
    navigate(`/edit-todo/${id}`);
  };

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-white text-3xl font-bold mb-4">To-Do List</h1>
      <div className="mb-4 flex items-center space-x-2">
        <label
          className="block mb-2 text-sm font-bold text-white"
          htmlFor="date"
        >
          Filter by Date
        </label>
        <input
          type="date"
          id="date"
          className="px-2 py-1 border border-gray-900 rounded text-sm"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
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
                <div className="mt-2 sm:mt-0 sm:ml-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(todo.id)}
                    className="px-2 py-1 bg-green-700 text-white rounded"
                  >
                    Edit
                  </button>
                </div>
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
