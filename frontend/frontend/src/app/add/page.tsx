"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { encryptAES } from "@/utils/cryptoUtil";
import { addVaultItem, getVaultItems } from "@/utils/api";
import { generateStrongPassword } from "@/utils/generatePassword";
import { useAuth } from "@/context/AuthContext";

export default function AddPasswordPage() {
  const [siteName, setSiteName] = useState("");
  const [password, setPassword] = useState("");
  const [vault, setVault] = useState([]);
  const [length, setLength] = useState(16); // Slider state for password length
  const { token, keyHex } = useAuth();

  const handleGenerate = () => {
    const newPass = generateStrongPassword(length);
    setPassword(newPass);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !password) return alert("Please fill both fields");
    if (!token) return alert("Please log in again");
    if (!keyHex) return alert("Unlock your vault first");

    try {
      const encrypted = encryptAES(password, keyHex);
      await addVaultItem(token, siteName, encrypted);

      setSiteName("");
      setPassword("");

      const updated = await getVaultItems(token);
      setVault(Array.isArray(updated) ? updated : updated.vault || []);

      alert("Password added successfully!");
    } catch (err) {
      console.error("Error adding password:", err);
      alert("Failed to add password");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <h2 className="text-3xl font-semibold text-green-400 mb-8">
          Add New Password
        </h2>

        <form
          onSubmit={handleAdd}
          className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5"
        >
          {/* Site Name */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="e.g. GitHub, Gmail"
              className="w-full p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or generate password"
                className="flex-1 p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
              />
              <button
                type="button"
                onClick={handleGenerate}
                className="bg-green-500 hover:bg-green-600 text-black font-semibold px-3 py-2 rounded transition"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Password Length Slider */}
          <div className="mt-2">
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Password Length: <span className="text-green-400">{length}</span>
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-gray-500 text-xs mt-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Password Guidelines */}
          <div className="text-gray-500 text-sm mt-2 space-y-1 border-t border-gray-800 pt-3">
            <p>🔹 Use at least 12 characters.</p>
            <p>🔹 Include uppercase, lowercase, numbers & symbols.</p>
            <p>🔹 Avoid dictionary words or personal info.</p>
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded transition"
          >
            Save Password
          </button>
        </form>
      </div>
    </main>
  );
}
