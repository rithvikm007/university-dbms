"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const roleMapping = {
    professor: "Professor",
    associate_professor: "Associate Professor",
    assistant_professor: "Assistant Professor",
  };
  

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch("/api/faculty");
        const data = await response.json();

        if (response.ok) {
          setFaculty(data.faculty);
        } else {
          setError("Failed to fetch faculty members.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Faculty Members</h1>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : faculty.length === 0 ? (
          <p className="text-center text-gray-400">No faculty members found.</p>
        ) : (
          <div className="space-y-2">
            {faculty.map((member) => (
              <div
                key={member.faculty_id}
                className="p-1 pl-3 bg-gray-200 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center space-x-4">
                  <h3 className="text-lg font-semibold text-black">{member.name}</h3>
                  <p className="text-black">
                    Role: {roleMapping[member.role] || "Unknown Role"}
                  </p>
                  <p className="text-black">Department Name: {member.department_name}</p>
                </div>

                <button
                  onClick={() => router.push(`/faculty/${member.faculty_id}`)}
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
