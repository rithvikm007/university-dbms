"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function AddCourse() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/departments", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setDepartments(data.departments);
          setLoading(false);
        } else {
          setError("Failed to load departments.");
        }
      } catch (error) {
        setError("Something went wrong while fetching departments.");
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const courseData = {
      name: event.target.name.value,
      credits: parseInt(event.target.credits.value, 10),
      semester: parseInt(event.target.semester.value, 10),
      department_id: parseInt(event.target.departmentId.value, 10),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Course added successfully!");
        setError("");
        setTimeout(() => {
          router.push("/courses");
        }, 1000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading && <Loading />}
        {!loading && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Add Course</h2>
            <form onSubmit={handleSubmit}>
              {/* Course Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Course Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Credits */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="credits">
                  Credits<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  required
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Semester */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="semester">
                  Semester<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="semester"
                  name="semester"
                  required
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="departmentId">
                  Department<span className="text-red-500">*</span>
                </label>
                <select
                  id="departmentId"
                  name="departmentId"
                  required
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Add Course
              </button>
            </form>

            {/* Display success or error message */}
            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}
          </>
        )}
      </div>
    </div>
  );
}
