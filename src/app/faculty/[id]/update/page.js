"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function UpdateFaculty() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const roles = ["Professor", "Associate Professor", "Assistant Professor"];
  const roleMapping = {
    "Professor": "professor",
    "Associate Professor": "associate_professor",
    "Assistant Professor": "assistant_professor",
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/faculty/${id}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.faculty.name);
          setEmail(data.faculty.email);
          setPhone(data.faculty.phone_no);
          setDepartmentId(data.faculty.department_id);
          setRole(data.faculty.role);
          setLoading(false);
        } else {
          setError("Faculty member not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching faculty:", error);
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

    fetchFaculty();
    fetchDepartments();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/faculty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, department_id: departmentId, role }),
      });

      if (response.ok) {
        setSuccess("Faculty details updated successfully!");
        setTimeout(() => router.push(`/faculty/${id}`), 1000);
      } else {
        setError("Failed to update faculty details.");
      }
    } catch (error) {
      setError("Something went wrong.");
      console.error("Error updating faculty:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading? <Loading /> : 
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Update Faculty</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
              {roles.map((role) => (
                <option key={role} value={roleMapping[role]}>{role}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            Update Faculty
          </button>
        </form>
          </>
        }
      </div>
    </div>
  );
}
