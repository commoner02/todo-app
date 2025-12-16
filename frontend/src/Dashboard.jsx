import React, { useState, useEffect } from "react";

function Dashboard() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/todos', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      // Basic check: If fetch failed, return an empty array (simple error handling)
      if (!response.ok) {
        console.error("Failed to fetch todos:", response.status);
        return;
      }

      const data = await response.json();
      setTodos(data);
      console.log(data)

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Run once on mount

  return (
    <div>
      <div className="flex justify-around p-4">
        <h1 className="text-2xl font-bold text-orange-700">ToDo.</h1>
        <button className="border-2 p-1 text-red-600">Logout</button>
      </div>
      <div className="text-center">
        <h1 className="font-bold text-3xl p-2">Manage Your Todos</h1><hr />

        <div className="flex flex-col items-center">
          {todos.map((todoItem) => (
            <div
              key={todoItem.id}
              className="flex justify-center gap-6 m-4 items-center pb-4 border-b w-full max-w-lg"
            >
              <h2 className={`p-2 ${todoItem.completed ? 'line-through' : ''}`}>
                {todoItem.todo}
              </h2>
              <button className="text-blue-600 border-2 p-1">
                {todoItem.completed ? 'Undo' : 'Complete'}
              </button>
              <button className="border-red-600 border-2 p-1 text-red-500">
                Delete
              </button>
            </div>
          ))}
          {todos.length === 0 && <p className="p-4 text-gray-600">No todos found.</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;