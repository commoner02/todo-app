import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { todosAPI } from "../api/index";
import TodoItem from "../components/TodoItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, Plus, CheckCircle } from "lucide-react";
import { showToast } from "../lib/toast";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await todosAPI.getAll();
      setTodos(res.data);
    } catch {
      showToast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTodo.trim()) {
      showToast.error("Please enter a todo");
      return;
    }

    try {
      const res = await todosAPI.create(newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo("");
      showToast.success("Todo added");
    } catch {
      showToast.error("Failed to add todo");
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await todosAPI.toggle(id, completed);
      setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
      showToast.success("Todo updated");
    } catch {
      showToast.error("Failed to update todo");
    }
  };

  const handleUpdate = async (id, todoText) => {
    try {
      const res = await todosAPI.update(id, todoText);
      setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
      showToast.success("Todo updated");
    } catch {
      showToast.error("Failed to update todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      showToast.success("Todo deleted");
    } catch {
      showToast.error("Failed to delete todo");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      showToast.error("Failed to logout");
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Stats
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen pb-20 bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="bg-rose-500 text-white px-1 py-1 rounded">
                Todo
              </span>
              ist
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Welcome, <span className="font-medium">{user?.username}</span>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Add New Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                />
                <Button
                  onClick={handleCreate}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-medium">{todos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-medium text-blue-600">
                    {activeCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {completedCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Your Todos</CardTitle>
                <CardDescription className="text-sm">
                  {filter === "all" && "All your todos"}
                  {filter === "active" && "Active todos only"}
                  {filter === "completed" && "Completed todos"}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("active")}
                  className="text-xs"
                >
                  Active
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className="text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-rose-600 mb-2" />
                <p className="text-sm text-gray-600">Loading todos...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  {filter === "all"
                    ? "No todos yet"
                    : filter === "active"
                      ? "No active todos"
                      : "No completed todos"}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {filter === "all"
                    ? "Add your first todo above"
                    : filter === "active"
                      ? "All todos are completed"
                      : "Complete some todos to see them here"}
                </p>
                {filter !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="text-xs"
                  >
                    View all todos
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-gray-500">
          {todos.length > 0 && (
            <div className="mb-2">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-xs mx-auto">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(completedCount / todos.length) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-1">
                {Math.round((completedCount / todos.length) * 100)}% complete
              </div>
            </div>
          )}
          <div>
            {activeCount} left • {completedCount} done
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
