"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/loading";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if the token is stored in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");  // Redirect to login if no token
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/verifyAdmin", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.userType === "admin") {
          setLoading(false); 
        } else {
          setError("You do not have permission to access this page.");
          router.push("/login"); 
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchUserDetails();
  }, [router]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading ? <Loading /> : (
          <>

          
          
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Admin Dashboard</h2>
        <p className="text-center text-black">Welcome to the admin dashboard.</p>
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        {/* Add Student Button */}
        <button
          onClick={() => router.push("/students/new")}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
        >
          Add Student
        </button>

        {/* Add Faculty Button */}
        <button
          onClick={() => router.push("/faculties/new")}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
        >
          Add Faculty
        </button>
        {/* Add Faculty Button */}
        <button
          onClick={() => router.push("/departments/new")}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
        >
          Add Department
        </button>
        {/* Add Course Button */}
        <button
          onClick={() => router.push("/courses/new")}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
        >
          Add Course
        </button>
        {/* Log Out Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login"); 
          }}
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4"
        >
          Log Out
        </button>
        </>
        )}
      </div>
    </div>
  );
}
