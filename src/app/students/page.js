"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function FacultyList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();

        if (response.ok) {
          setStudents(data.students);
        } else {
          setError("Failed to fetch Students.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Students</h1>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-400">No Students found.</p>
        ) : (
          <div className="space-y-2">
            {students.map((member) => (
              <div
                key={member.student_id}
                className="p-1 pl-3 bg-gray-200 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center space-x-4">
                  <h3 className="text-lg font-semibold text-black">{member.name}</h3>
                  <p className="text-black">Department Name: {member.department_name}</p>
                </div>

                <button
                  onClick={() => router.push(`/students/${member.student_id}`)}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
