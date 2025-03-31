"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AdminSignUp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = jwtDecode(token);

    if (decodedToken.userType !== "admin") {
      router.back();
      return;
    }

  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone_no = event.target.phone_no.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone_no, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message); // Success message
        setError(""); // Clear any error messages
      } else {
        setError(data.error || "Something went wrong");
        setSuccess(""); // Clear any success message
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setSuccess(""); // Clear any success message
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Admin Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone_no">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Admin
          </button>
        </form>
        <button
          onClick={() => router.back()}
          className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
        >
          Go Back
        </button>
        {/* Display Success Message */}
        {success && (
          <div className="mt-4 text-green-500 text-sm">
            {success}
          </div>
        )}

        {/* Display Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
