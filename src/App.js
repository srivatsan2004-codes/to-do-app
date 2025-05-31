import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      setTasks(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (task.trim() !== "") {
      const docRef = await addDoc(collection(db, "tasks"), { text: task });
      setTasks([...tasks, { text: task, id: docRef.id }]);
      setTask("");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>To-Do List</h2>

      {!user ? (
        <button onClick={() => signInWithPopup(auth, provider).then((result) => setUser(result.user))}>Login with Google</button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={() => { signOut(auth); setUser(null); }}>Logout</button>
        </>
      )}

      {user && (
        <>
          <input value={task} onChange={(e) => setTask(e.target.value)} />
          <button onClick={handleAdd}>Add Task</button>

          <ul>
            {tasks.map((t) => (
              <li key={t.id}>
                {t.text} <button onClick={() => handleDelete(t.id)}>❌</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

