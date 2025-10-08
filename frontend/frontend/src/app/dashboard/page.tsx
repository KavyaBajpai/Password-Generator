"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getVaultItems, addVaultItem, deleteVaultItem } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 
import { encryptAES, decryptAES } from "@/utils/cryptoUtil"; 

interface VaultItem {
  _id: string;
  siteName: string;
  hashedPassword: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [siteName, setSiteName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { token, keyHex } = useAuth(); 

  
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const data = await getVaultItems(token);
        setVault(Array.isArray(data) ? data : data.vault || []);
      } catch (err) {
        console.error("Error fetching vault:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Add password
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !password) return;
    if (!token) return alert("Please log in again");
    if (!keyHex) return alert("Unlock your vault first");

    try {
     
      const encrypted = encryptAES(password, keyHex);

      await addVaultItem(token, siteName, encrypted);

      setSiteName("");
      setPassword("");

      
      const updated = await getVaultItems(token);
      setVault(Array.isArray(updated) ? updated : updated.vault || []);
    } catch (err) {
      console.error("Error adding password:", err);
    }
  };

  // Delete password
  const handleDelete = async (id: string) => {
    try {
      router.push(`/reverify/${id}`);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      router.push(`/reverifyEdit/${id}`);
    } catch (err) {
      console.error("Error editing item:", err);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-3xl mx-auto pt-32 px-4">
        <h1 className="text-3xl font-semibold text-green-400 mb-6">
          Your Vault
        </h1>

        {/* Add Password Form */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-900 p-4 rounded-lg"
        >
          <input
            type="text"
            placeholder="Site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="flex-1 p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded transition"
          >
            Add
          </button>
        </form>

        {/* Vault Table */}
        {vault.length === 0 ? (
          <p className="text-gray-500">No passwords saved yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-800 text-gray-400">
                <th className="py-2">Site</th>
                <th className="py-2">Password</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vault.map((item) => (
                <tr key={item._id} className="border-b border-gray-800">
                  <td className="py-2">{item.siteName}</td>
                  <td className="py-2 text-gray-300">
                 
                    {keyHex
                      ? decryptAES(item.hashedPassword, keyHex)
                      : "••••••"}
                  </td>
                  <td className="py-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-400 hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-white text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


