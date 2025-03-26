"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddFaculty() {
  const [departments, setDepartments] = useState([]); // Store department list
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  
  
  const roles = ["Professor", "Associate Professor", "Assistant Professor"];
  const roleMapping = {
    "Professor": "professor",
    "Associate Professor": "associate_professor",
    "Assistant Professor": "assistant_professor",
  };

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
    const selectedRole = event.target.role.value;
    const roleEnumValue = roleMapping[selectedRole];

    const facultyData = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone_no: event.target.phone_no.value, 
      password: event.target.password.value,
      departmentId: event.target.departmentId.value,
      role: roleEnumValue,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(facultyData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Faculty added successfully!");
        setError("");
        setTimeout(() => {
          router.push("/faculty");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Add Faculty</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
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
              Email Address
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
              Phone Number
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
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="departmentId">
              Department
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

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Add Faculty
          </button>
        </form>

        {/* Display success or error message */}
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}
      </div>
    </div>
  );
}
