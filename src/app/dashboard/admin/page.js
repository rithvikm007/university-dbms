"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaChalkboardTeacher, FaBuilding, FaBook, FaSignOutAlt, FaTasks } from "react-icons/fa";
import Loading from "../../components/loading";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.user_type === "admin") {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-black text-center">Admin Dashboard</h2>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => router.push("/students/new")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <FaUserPlus /> Add Student
              </button>

              <button onClick={() => router.push("/faculties/new")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <FaChalkboardTeacher /> Add Faculty
              </button>

              <button onClick={() => router.push("/departments/new")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <FaBuilding /> Add Department
              </button>

              <button onClick={() => router.push("/courses/new")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <FaBook /> Add Course
              </button>
              <button onClick={() => router.push("/classes/new")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <FaTasks /> Assign Course
              </button>
              <button onClick={() => router.push("/signup")} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                 Add an Admin
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 mt-6"
            >
              <FaSignOutAlt /> Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
