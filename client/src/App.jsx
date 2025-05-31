import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import UserAuth from "./components/UserAuth";
import DarkModeToggle from "./components/DarkModeToggle";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function App() {
  // All hooks at the top
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in, object = logged in
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Listen for tasks only when user is logged in
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    await addDoc(collection(db, "tasks"), {
      text: taskInput.trim(),
      completed: false,
      createdAt: new Date(),
      uid: user.uid, // associate tasks with user (optional)
    });
    setTaskInput("");
  };

  const toggleTask = async (id, completed) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: !completed });
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  // Loading state (auth check)
  if (user === undefined) {
    return <div style={{ color: "blue", textAlign: "center", marginTop: 50 }}>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <UserAuth onAuth={setUser} />;
  }

  // Main To-Do App
  return (
    <div className="min-h-screen bg-white dark:bg-[#15202b] transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400 tracking-tight">X To-Do</h1>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            onClick={handleSignOut}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      </header>
      {/* Main content */}
      <main className="flex flex-col items-center mt-10">
        <div className="bg-gray-50 dark:bg-[#192734] rounded-xl shadow-lg max-w-md w-full p-8">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Clean & Modern To-Do
          </h2>
          <form onSubmit={addTask} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter a new task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-[#22303c] text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="New task"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 rounded-lg transition transform active:scale-95"
            >
              Add
            </button>
          </form>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
            {loading ? (
              <li className="py-20 text-center text-gray-400 italic select-none">
                Loading...
              </li>
            ) : tasks.length === 0 ? (
              <li className="py-20 text-center text-gray-400 italic select-none">
                No tasks yet. Add your first one!
              </li>
            ) : (
              tasks.map(({ id, text, completed }) => (
                <li
                  key={id}
                  className="flex items-center justify-between py-3"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-grow select-none">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() => toggleTask(id, completed)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                      aria-label={`Mark task "${text}" as completed`}
                    />
                    <span
                      className={`text-gray-900 dark:text-gray-100 text-lg ${
                        completed ? "line-through text-gray-400 dark:text-gray-500" : ""
                      }`}
                    >
                      {text}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTask(id)}
                    className="text-red-500 hover:text-red-600 text-xl font-bold transition"
                    aria-label={`Delete task "${text}"`}
                  >
                    &times;
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
