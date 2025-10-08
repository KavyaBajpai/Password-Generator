"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import { verifyAndEdit } from "@/utils/api";
import { useAuth } from "@/context/AuthContext"; 
import { encryptAES } from "@/utils/cryptoUtil"; 

export default function ReverifyPage() {
  const router = useRouter();
  const { id } = useParams(); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const { keyHex } = useAuth();

 const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    
let encryptedNewPassword = newPassword;
console.log("newpassword ",newPassword);
console.log("keyhex ",keyHex);
if (keyHex && newPassword) {
  console.log("editing");
  encryptedNewPassword = encryptAES(newPassword, keyHex);
}

    const res = await verifyAndEdit(token, id as string, password, newSiteName, encryptedNewPassword);
    console.log(res);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.message || "Verification failed");
    }
  } catch (err) {
    setError("Invalid password or action failed");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-40">
        <h2 className="text-3xl font-semibold text-green-400 mb-6">
          Confirm Update
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Please enter your account password to confirm deletion.
        </p>

        <form
          onSubmit={handleVerify}
          className="bg-gray-900 p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="Account password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />

          <input
          type="text"
          placeholder="enter new name for the site"
          value={newSiteName}
          onChange={(e)=> setNewSiteName(e.target.value)}
           className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"/>

          <input
          type="password"
          placeholder="enter new password for the site"
          value={newPassword}
          onChange={(e)=> setNewPassword(e.target.value)}
           className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"/>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm Updation"}
          </button>
        </form>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 text-sm mt-6 hover:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
