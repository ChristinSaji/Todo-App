import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTodo() {
  const [task, setTask] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleAddTodo = (e) => {
    e.preventDefault();

    const processAndSendData = (data) => {
      axios
        .post(import.meta.env.VITE_LAMBDA_URL_ADD, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("To-Do added:", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("There was an error adding the to-do!", error);
        });
    };

    if (attachment) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(attachment);
      fileReader.onload = () => {
        const base64Content = fileReader.result.split(",")[1];
        const data = {
          task: task,
          date: date,
          attachment: {
            filename: attachment.name,
            content: base64Content,
          },
        };
        processAndSendData(data);
      };
    } else {
      const data = { task: task, date: date };
      processAndSendData(data);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add To-Do</h2>
      <form onSubmit={handleAddTodo}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold" htmlFor="task">
            Task
          </label>
          <input
            type="text"
            id="task"
            className="w-full px-3 py-2 border border-gray-900 rounded"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full px-3 py-2 border border-gray-900 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold" htmlFor="attachment">
            Attachment
          </label>
          <input
            type="file"
            id="attachment"
            className="w-full px-3 py-2 border border-gray-900 rounded"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded"
        >
          Add To-Do
        </button>
      </form>
    </div>
  );
}

export default AddTodo;
