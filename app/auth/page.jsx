"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { hash } from "bcryptjs";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Auth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const hashedPassword = await hash(password, 12);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            email,
            password: hashedPassword,
            name,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          // After successful signup, login with unhashed password
          const loginRes = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (loginRes?.error) {
            setError(loginRes.error);
          } else {
            router.refresh();
            router.push("/");
          }
        } else {
          setError(data.message);
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.refresh();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p>Loading ...</p>;
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <p className="mb-4">Signed in as {session?.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900/30 relative">
      <div className="absolute top-10 left-20 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-green-500/20 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 mt-16 py-2 rounded-xl shadow-2xl w-[28rem] backdrop-blur-xl border-[1px] border-white/10 bg-white/5 relative"
      >
        <div className="absolute inset-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />

        <h2 className="text-2xl font-bold mt-6 mb-1 text-left text-white">
          {isSignup ? "Create Account" : "Welcome back"}
        </h2>
        <h2 className="text-sm font-light mt-2 mb-6 text-left text-white/70">
          {isSignup
            ? "Sign up to get started"
            : "Login to your account to continue"}
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 border-gray-300/10 focus:ring-purple-400 focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 border-gray-300/10 focus:ring-purple-400 focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 border-gray-300/10 focus:ring-purple-400 focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting
              ? isSignup
                ? "Signing up..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-gray-300 hover:text-white mt-4 block mx-auto mb-4 transition-colors"
        >
          {isSignup ? "Already have an account? Log In" : "Create an Account"}
        </button>
      </motion.div>
    </div>
  );
}
