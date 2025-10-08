"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getVaultItems } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { decryptAES } from "@/utils/cryptoUtil";

interface VaultItem {
  _id: string;
  siteName: string;
  hashedPassword: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState("");
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

  const handleAdd = () => {
    router.push("/add");
  };

  const handleDelete = (id: string) => {
    router.push(`/reverify/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/reverifyEdit/${id}`);
  };

  const filteredVault = vault.filter((item) =>
    item.siteName.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Search Bar + Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by site name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200 placeholder-gray-500"
          />
          <button
            onClick={handleAdd}
            className="px-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition w-full md:w-auto"
          >
            + Add
          </button>
        </div>

        {/* Vault Table */}
        {filteredVault.length === 0 ? (
          <p className="text-gray-500">No matching passwords found.</p>
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
              {filteredVault.map((item) => (
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
