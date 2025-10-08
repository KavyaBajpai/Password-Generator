"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupUser } from "@/utils/api"; 

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ 1. Basic empty field check
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // ✅ 2. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ✅ 3. Password strength check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special symbol."
      );
      return;
    }

    // ✅ 4. Call backend if validation passes
    try {
      const res = await signupUser(name, email, password);
      if (res.success) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(res.message || "Signup failed. Try again.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-40">
        <h2 className="text-3xl font-semibold text-green-400 mb-6">
          Create an account
        </h2>

        <form
          onSubmit={handleSignup}
          className="bg-gray-900 p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-black border border-gray-700 focus:border-green-400 focus:outline-none text-gray-200"
          />
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
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
