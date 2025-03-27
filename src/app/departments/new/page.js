"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDepartment() {
  const [name, setName] = useState("");
  const [assignHod, setAssignHod] = useState(false);
  const [hodDetails, setHodDetails] = useState({
    name: "",
    email: "",
    phone_no: "",
    password: "",
    role: "professor",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const roles = ["Professor", "Associate Professor", "Assistant Professor"];
  const roleMapping = {
    "Professor": "professor",
    "Associate Professor": "associate_professor",
    "Assistant Professor": "assistant_professor",
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const departmentData = {
      name,
      hod: assignHod
        ? {
            name: hodDetails.name,
            email: hodDetails.email,
            phone_no: hodDetails.phone_no,
            password: hodDetails.password,
            role: hodDetails.role, 
          }
        : null,
    };
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSuccess("Department added successfully!");
        setError("");
        setName("");
        setAssignHod(false);
        setHodDetails({
          name: "",
          email: "",
          phone_no: "",
          password: "",
          role: "professor",
        });
        router.push("/departments");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Add Department</h2>
        <form onSubmit={handleSubmit}>
          {/* Department Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Assign HOD Toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign HOD now?</label>
            <div className="flex space-x-4 mt-1">
            <button
                type="button"
                onClick={() => setAssignHod(true)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${
                  assignHod ? "bg-indigo-600 text-white" : "bg-gray-300 !text-black"
                } hover:scale-105`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAssignHod(false)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${
                  !assignHod ? "bg-indigo-600 text-white" : "bg-gray-300 !text-black"
                } hover:scale-105`}
              >
                No
              </button>
            </div>
          </div>

          {/* HOD Fields */}
          {assignHod && (
            <div>
            
            {/* Name */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={hodDetails.name}
                  name="name"
                  required
                  onChange={(e) => setHodDetails({ ...hodDetails, name: e.target.value })}
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
                  value={hodDetails.email}
                  required
                  onChange={(e) => setHodDetails({ ...hodDetails, email: e.target.value })}
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
                  value={hodDetails.phone_no}
                  onChange={(e) => setHodDetails({ ...hodDetails, phone_no: e.target.value })}
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
                  value={hodDetails.password}
                  onChange={(e) => setHodDetails({ ...hodDetails, password: e.target.value })}
                  className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="departmentId">
                  Department<span className="text-red-500">*</span>
                </label>
                <input
                  disabled={true}
                  id="departmentId"
                  name="departmentId"
                  required
                  value={name}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                  Role<span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={hodDetails.role}
                  required
                  onChange={(e) => setHodDetails({ ...hodDetails, role: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {Object.entries(roleMapping).map(([display, value]) => {
                    return (
                      <option key={value} value={value}>
                        {display}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
            Add Department
          </button>
        </form>
        {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
}
