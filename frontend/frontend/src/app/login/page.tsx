"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from '@/utils/api'
import { deriveKey } from "@/utils/cryptoUtil"; 
import { useAuth } from "@/context/AuthContext"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(email, password); 
      const token = res?.token;
      console.log("token: ", token);
      if (token) {
        
        const keyHex = deriveKey(password, email);
        
        
        console.log("set auth called in login: ")
        setAuth(token, keyHex, email);

        router.push("/dashboard"); 
      } else {
        setError("Invalid login response");
      }
    } catch (err: any) {
      setError("Invalid credentials or server error");
      console.error("Login error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-40">
        <h2 className="text-3xl font-semibold text-green-400 mb-6">
          Welcome back
        </h2>

        <form
          onSubmit={handleLogin}
          className="bg-gray-900 p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
