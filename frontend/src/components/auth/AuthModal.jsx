import { useState } from "react";
import axios from "axios";
import { XIcon } from "../ui/Icons";
import { socket } from "../../socket"; // Adjust this path if your socket.js is elsewhere

/**
 * Modal for logging in or signing up with Real Backend Integration
 */
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    // Basic validation
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Determine the correct backend endpoint
      const endpoint =
        mode === "login"
          ? "http://localhost:4000/api/auth/login"
          : "http://localhost:4000/api/auth/register";

      // 2. Make the API request
      const response = await axios.post(endpoint, {
        username: form.name || form.email.split("@")[0],
        email: form.email,
        password: form.password,
      });

      // 3. Destructure the data returned from your Express server
      const { token, _id, username } = response.data;

      // 4. Save to LocalStorage for persistence
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("username", username);

      // 5. Connect the Real-time Socket
      socket.connect();

      // 6. Update App State and close modal
      onLogin({
        name: username,
        email: form.email,
        id: _id,
        token: token,
      });

      onClose();
    } catch (err) {
      // Catch errors from our backend errorHandler.js
      const message = err.response?.data?.message || "Connection failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400" />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/50">
              ⚠️ {error}
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`flex-1 py-2.5 text-sm font-bold transition-all
                  ${
                    mode === m
                      ? "bg-red-600 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {mode === "signup" && (
              <Field label="Display Name">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className={inputCls}
                />
              </Field>
            )}
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </Field>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold
              rounded-xl transition-all shadow-lg shadow-red-600/20 text-sm tracking-wide 
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Log In →"
                : "Create Account →"}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-red-500 font-bold hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 " +
  "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm " +
  "focus:outline-none focus:border-red-500 transition-colors";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

export default AuthModal;
