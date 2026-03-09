import { useState } from "react";
import { XIcon } from "../ui/Icons";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500 transition-colors";

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

/**
 * Login / Sign-up modal.
 * Props: onClose, onLogin(userData)
 */
export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.email) return;
    onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400" />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
              <XIcon />
            </button>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-bold capitalize transition-all ${mode === m ? "bg-red-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <Field label="Display Name">
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className={inputCls} />
              </Field>
            )}
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
            </Field>
            <Field label="Password">
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className={inputCls} />
            </Field>
          </div>

          <button onClick={handleSubmit}
            className="mt-6 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 text-sm tracking-wide">
            {mode === "login" ? "Log In →" : "Create Account →"}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-red-500 font-bold hover:underline">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
