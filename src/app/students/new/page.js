"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function AddStudent() {
  const [departments, setDepartments] = useState([]); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admissionYear, setAdmissionYear] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setAdmissionYear(currentYear);
  }, []);

  useEffect(() => {
    // Fetch department list from API
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

    const studentData = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone_no: event.target.phone_no.value, 
      password: event.target.password.value,
      dob: event.target.dob.value,
      admission_year: event.target.admission_year.value,
      graduation_year: event.target.graduation_year.value,
      departmentId: event.target.departmentId.value,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Student added successfully!");
        setError("");
        setTimeout(() => {
          router.push("/students");
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
          
         
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Add New Student</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone_no">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone_no"
              name="phone_no"
              required
              pattern="[0-9]{10}"
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="dob">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Admission Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="admission_year">
              Admission Year<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="admission_year"
              name="admission_year"
              required
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Graduation Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="graduation_year">
              Graduation Year
            </label>
            <input
              type="number"
              id="graduation_year"
              name="graduation_year"
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Add Student
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
