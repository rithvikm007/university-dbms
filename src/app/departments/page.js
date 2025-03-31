"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        const data = await response.json();
        if (response.ok) {
          setDepartments(data.departments);
        } else {
          setError("Failed to load departments.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Departments</h2>

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {!loading && error && <p className="text-red-500 text-center">{error}</p>}

        {/* Departments List */}
        {!loading && !error && (
          <>
            {departments.length === 0 ? (
              <p className="text-gray-600 text-center">No departments available.</p>
            ) : (
              <ul>
                {departments.map((dept) => (
                  <li
                    key={dept.department_id}
                    className="py-2 px-4 text-black bg-gray-200 rounded-md mb-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => router.push(`/departments/${dept.department_id}`)}
                  >
                    {dept.name}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => router.back()}
              className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
          </>
        )}

        {/* Admin-only button */}
        {typeof window !== "undefined" && localStorage.getItem("userType") === "admin" && (
          <button
            onClick={() => router.push("/departments/new")}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
          >
            Add Department
          </button>
        )}
      </div>
    </div>
  );
}
