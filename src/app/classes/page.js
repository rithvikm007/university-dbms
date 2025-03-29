"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/components/loading";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes");
        const data = await response.json();

        if (response.ok) {
          setClasses(data.classes || []);
        } else {
          setError(data.error || "Failed to load classes.");
        }
      } catch (err) {
        setError("Something went wrong while fetching classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Class List</h2>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : classes.length === 0 ? (
          <p className="text-gray-500 text-center">No classes available.</p>
        ) : (
          <ul className="space-y-4">
            {classes.map((cls, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {cls.course_name}
                </p>
                <p className="text-gray-600">Faculty: {cls.faculty_name}</p>

                <div className="flex justify-between mt-2">
                  <Link
                    href={`/classes/${cls.course_id}/${cls.faculty_id}`}
                    className="text-indigo-600"
                  >
                    View More Details &gt;&gt;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
