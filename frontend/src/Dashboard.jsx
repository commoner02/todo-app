import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL

const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      console.log('new access token generated using refresh token');
      return true;
    }
    throw new Error('Failed to refresh token');

  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/auth');
  }

  const fetchTodos = async () => {
    try {
      console.log("fetching todos..")
      let response = await fetch(`${API_BASE}/todos`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await refreshToken();

      if (response.status === 401) {
        console.log("401 error")
        if (response.code == "NO_ACCESS_TOKEN" || response.code === "TOKEN_EXPIRED") {
          console.log("no access token or token expired")
          const refreshed = await refreshToken();
          if (refreshed) {
            response = await fetch(`${API_BASE}/todos`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        else {
          navigate('/auth');
          return;
        }
      }

      if (!response.ok) {
        console.log("failed to fetch todos", response.status)
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
  }, []);  //Run once on mount

  return (
    <div>
      <div className="flex justify-around p-4">
        <h1 className="text-2xl font-bold text-orange-700">ToDo.</h1>
        <button onClick={handleLogout} className="border-2 p-1 text-red-600">Logout</button>
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

