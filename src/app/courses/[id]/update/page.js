"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function UpdateCourse() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [semester, setSemester] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.course.name);
          setCredits(data.course.credits);
          setSemester(data.course.semester);
          setDepartmentId(data.course.department_id);
          setLoading(false);
        } else {
          setError("Course not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching course:", error);
      }
    };

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
        setError("Something went wrong while fetching departments.");
        console.error("Error fetching departments:", error);
      }
    };

    fetchCourse();
    fetchDepartments();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, credits, semester, department_id: departmentId }),
      });

      if (response.ok) {
        setSuccess("Course updated successfully!");
        setTimeout(() => router.push(`/courses/${id}`), 1000);
      } else {
        setError("Failed to update course.");
      }
    } catch (error) {
      setError("Something went wrong.");
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading ? <Loading /> : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Update Course</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Credits</label>
                <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)}
                  className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <input type="number" value={semester} onChange={(e) => setSemester(e.target.value)}
                  className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
                  className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Update Course
              </button>
            </form>

            <button
              onClick={() => router.back()}
              className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}