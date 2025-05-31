import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function UserAuth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuth(auth.currentUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onAuth(auth.currentUser);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      onAuth(auth.currentUser);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#15202b]">
      <div className="bg-white dark:bg-[#192734] p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500 dark:text-blue-400">Login</h2>
        <form onSubmit={handleSignIn} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#22303c] text-gray-900 dark:text-gray-100"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#22303c] text-gray-900 dark:text-gray-100"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-2 font-semibold hover:bg-blue-600 transition">Sign In</button>
        </form>
        <form onSubmit={handleSignUp} className="flex flex-col gap-3 mt-2">
          <button type="submit" className="bg-green-500 text-white rounded p-2 font-semibold hover:bg-green-600 transition">Sign Up</button>
        </form>
        <div className="mt-4 flex flex-col gap-2">
          <button onClick={handleGoogleLogin} className="bg-red-500 text-white rounded p-2 font-semibold hover:bg-red-600 transition">Sign in with Google</button>
        </div>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
}
