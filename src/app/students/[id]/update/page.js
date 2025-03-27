"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function UpdateStudent() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

    
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        const data = await response.json();

        if (response.ok) {
            setName(data.student.name);
            setEmail(data.student.email);
            setPhone(data.student.phone_no);
            setAdmissionYear(data.student.admission_year);
            setGraduationYear(data.student.graduation_year);
            setDepartmentId(data.student.department_id);
            setLoading(false);
        } else {
          setError("Student member not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching Student:", error);
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

    fetchStudent();
    fetchDepartments();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, department_id: departmentId, admission_year: admissionYear, graduation_year: graduationYear }),
      });

      if (response.ok) {
        setSuccess("Student details updated successfully!");
        setTimeout(() => router.push(`/students/${id}`), 1000);
      } else {
        setError("Failed to update student details.");
      }
    } catch (error) {
      setError("Something went wrong.");
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading? <Loading /> : 
          <>
          
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Update Student</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name<span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department<span className="text-red-500">*</span></label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
              ))}
            </select>
          </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Admission Year<span className="text-red-500">*</span></label>
            <input type="number" value={admissionYear} onChange={(e) => setAdmissionYear(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
              className="mt-1 block w-full px-4 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            Update Student
          </button>
        </form>
            <button
              onClick={() => router.push(`/faculties/${id}`)}
              className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
          </>
        }
      </div>
    </div>
  );
}
