"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/loading";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        return;
      }

      if (decodedToken.userType === "admin") {
        router.push("/dashboard/admin");
      } else if (decodedToken.userType === "faculty") {
        router.push("/dashboard/faculty");
      } else if (decodedToken.userType === "student") {
        router.push("/dashboard/student");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }
  }, [router]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); 

        const userDetailsResponse = await fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        const userDetails = await userDetailsResponse.json();
        if (userDetails.user_type === "admin") {
          router.push("/dashboard/admin");
        } else if (userDetails.user_type === "faculty") {
          router.push("/dashboard/faculty"); 
        } else if(userDetails.user_type === "student") {
          router.push("/dashboard/student");
        }
        else {
          setError("You do not have permission to access this page.");
          localStorage.removeItem("token"); // Remove invalid token
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login to UMS</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
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
          {loading && <Loading />}
          {!loading && (
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Log In
            </button>
          )}
        </form>

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
}
