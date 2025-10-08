"use client";

import Header from "@/components/Header";
import { signupUser } from "@/utils/api";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
       const res = await signupUser(name, email, password);
       console.log(res);
       if(res.success==true)
        router.push("/login");
      

    }
    catch(err){
      console.error("Login error:", err);
    }
    console.log({ name, email, password });

  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-40">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Create your account
        </h2>

        <form
          onSubmit={handleSignup}
          className="bg-gray-900 p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-black text-gray-200"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-black text-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-black text-gray-200"
          />

          <button
            type="submit"
            className="bg-white hover:bg-green-200 text-black font-semibold py-2 rounded transition"
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
