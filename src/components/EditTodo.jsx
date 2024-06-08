import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditTodo() {
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [attachment, setAttachment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_LAMBDA_URL_GET)
      .then((response) => {
        const todo = response.data.find((t) => t.id === id);
        if (todo) {
          setTask(todo.task);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the to-do!", error);
      });
  }, [id]);

  const handleEditTodo = (e) => {
    e.preventDefault();

    const processAndSendData = (data) => {
      axios
        .put(import.meta.env.VITE_LAMBDA_URL_UPDATE, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("To-Do updated:", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("There was an error updating the to-do!", error);
        });
    };

    if (attachment) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(attachment);
      fileReader.onload = () => {
        const base64Content = fileReader.result.split(",")[1];
        const data = {
          id: id,
          task: task,
          attachment: {
            filename: attachment.name,
            content: base64Content,
          },
        };
        processAndSendData(data);
      };
    } else {
      const data = { id: id, task: task };
      processAndSendData(data);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit To-Do</h2>
      <form onSubmit={handleEditTodo}>
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
          className="w-full bg-green-700 text-white py-2 rounded"
        >
          Update To-Do
        </button>
      </form>
    </div>
  );
}

export default EditTodo;
