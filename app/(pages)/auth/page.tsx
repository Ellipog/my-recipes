"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {isLogin ? (
          <LoginForm onSuccess={() => router.push("/")} />
        ) : (
          <RegisterForm onSuccess={() => router.push("/")} />
        )}

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
