"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ClassPage() {
  const { course_id, faculty_id } = useParams();
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/classes/${course_id}/${faculty_id}`);
        if (!res.ok) throw new Error("Class not found");

        const data = await res.json();
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class:", error);
        setError("Class not found.");
        setClassData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [course_id, faculty_id]);

  const deleteClass = async () => {
    try {
      await fetch(`/api/classes/${course_id}/${faculty_id}`, {
        method: "DELETE",
      });
      setSuccess("Class deleted successfully!");
      setTimeout(() => router.push("/classes"), 1000);
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-left">
        {loading ? (
          <Loading />
        ) : classData ? (
          <>
            <h2 className="text-2xl font-bold text-black mb-4">
              <span>Course: </span>{classData.course.name}
            </h2>
            <p className="text-black">
              <span className="font-medium">Faculty:</span> {classData.faculty.name}
            </p>
            <p className="text-black">
              <span className="font-medium">Department:</span> {classData.course.department}
            </p>
            <button
                onClick={() => deleteClass()}
                className="w-full h-10 py-2 px-3 bg-red-500 text-md text-white font-semibold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 mt-2"
              >
                Delete Class
              </button>
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mt-1"
            >
              Go Back
            </button>
            {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}
          </>
        ) : (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
