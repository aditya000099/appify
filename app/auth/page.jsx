"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { hash } from "bcryptjs";

export default function Auth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      try {
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
      } catch (error) {
        console.error("Error during sign up:", error);
        setError("Something went wrong during signup");
      }
    } else {
      try {
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
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login");
      }
    }
  };

  if (status === "loading") {
    return <p>Loading ...</p>;
  }

  if (status === "authenticated") {
    return (
      <div className="text-center">
        <p className="mb-4">Signed in as {session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>
      <button
        onClick={() => setIsSignup(!isSignup)}
        className="text-indigo-500 hover:text-indigo-400 mt-2 block mx-auto"
      >
        {isSignup ? "Already have an account? Log In" : "Create an Account"}
      </button>
    </div>
  );
}
