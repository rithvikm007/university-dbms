"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function UpdateDepartment() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [hod, setHod] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`/api/departments/${id}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.department.name);
          setHod(data.hod ? data.hod.user_id : null);
        } else {
          setError("Department not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching department:", error);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/faculties`);
        const data = await response.json();
        if (response.ok) {
          setFaculties(data.faculties);
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    Promise.all([fetchDepartment(), fetchFaculties()]).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, hod_id: hod }),
      });

      if (response.ok) {
        setSuccess("Department updated successfully!");
        setTimeout(() => router.push(`/departments/${id}`), 800);
      } else {
        setError("Failed to update department.");
      }
    } catch (error) {
      setError("Something went wrong.");
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {loading ? (
          <Loading />
        ) : (
          <>  
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Update Department</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Department Name Input */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md text-black"
                required
              />

              {/* HOD Dropdown */}
              <select
                value={hod || ""}
                onChange={(e) => setHod(e.target.value || null)}
                className="w-full p-2 border rounded-md text-black"
              >
                <option value="">No HOD Assigned</option>
                {faculties.map((faculty) => (
                  <option key={faculty.faculty_id} value={faculty.faculty_id}>
                    {faculty.User.name} ({faculty.User.email})
                  </option>
                ))}
              </select>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                Update
              </button>
            </form>
            <button
              onClick={() => router.back()}
              className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
            </>
            )
        }
      </div>
    </div>
  );
}
