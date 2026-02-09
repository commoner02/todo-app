import { useState } from "react";
import { Check, X, Edit2, Trash2 } from "lucide-react";

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.todo);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        todo.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Toggle Checkbox */}
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${
          todo.completed
            ? "bg-rose-500 border-rose-500"
            : "border-gray-300 hover:border-rose-400"
        }`}
      >
        {todo.completed && <Check className="h-3 w-3 text-white" />}
      </button>

      {/* Todo Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-2 py-1.5 text-sm bg-rose-500 text-white rounded hover:bg-rose-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1.5 text-sm border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={`text-base ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}
            >
              {todo.todo}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-rose-500"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
