import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddTodo from "./components/AddTodo";
import EditTodo from "./components/EditTodo";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <header className="bg-blue-700 text-white font-bold p-4 text-center text-2xl">
          To-Do List App
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-todo" element={<AddTodo />} />
            <Route path="/edit-todo/:id" element={<EditTodo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
