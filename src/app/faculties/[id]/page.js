"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ViewFaculty() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
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
        const response = await fetch(`/api/faculties/${id}`);
        const data = await response.json();

        if (response.ok) {
          setFaculty(data.faculty);
        } else {
          setError("Faculty member not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching faculty:", error);
      }
    };

    fetchFaculty();
  }, [id]);

  const deleteFaculty = async () => {
    try {
      const response = await fetch(`/api/faculties/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/faculty");
      } else {
        setError(data.error || "Failed to delete faculty.");
      }
    } catch (error) {
      setError("Failed to delete faculty.");
      console.error("Error deleting faculty:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-left">
        {faculty ? (
          <>
            <button
              onClick={() => router.push(`/faculty`)}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
            <h2 className="text-2xl font-bold text-black mb-4">
              <span>Faculty: </span>{faculty.name}
            </h2>
            <p className="text-black">Role: {roleMapping[faculty.role]}</p>
            <p className="text-black">Department ID: {faculty.department_id}</p>
            <div className="flex py-2 align-center justify-between">
              <button
                onClick={() => router.push(`/faculty/${id}/update`)}
                className="w-[49%] h-10 py-2 px-3 bg-yellow-500 text-md text-white font-semibold rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                Edit Faculty
              </button>
              <button
                onClick={() => deleteFaculty()}
                className="w-[49%] h-10 py-2 px-3 bg-red-500 text-md text-white font-semibold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Delete Faculty
              </button>
            </div>
            <p className="text-red-500 text-center font-semibold">{error}</p>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
