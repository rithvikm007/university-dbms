"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ViewStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [department, setDepartment] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        const data = await response.json();

        if (response.ok) {
          setStudent(data.student);
        } else {
          setError("Student not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching students:", error);
      }
    };

    fetchStudent();
  }, [id]);

  useEffect(() => {
    if (student?.department_id) {
      const fetchDepartment = async () => {
        try {
          const response = await fetch(`/api/departments/${student.department_id}`);
          const data = await response.json();

          if (response.ok) {
            setDepartment(data.department);
          } else {
            setError("Department not found.");
          }
        } catch (error) {
          setError("Something went wrong.");
          console.error("Error fetching department:", error);
        }
      };

      fetchDepartment();
    }
  }, [student]);

  const deleteStudent = async () => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/students");
      } else {
        setError(data.error || "Failed to delete student.");
      }
    } catch (error) {
      setError("Failed to delete student.");
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-left">
        {student ? (
          <>
            <button
              onClick={() => router.push(`/students`)}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
            <h2 className="text-2xl font-bold text-black mb-4">
              <span>Student Name: </span>{student.name}
            </h2>
            <p className="text-black">Email: {student.email}</p>
            <p className="text-black">Date of Birth: {student.dob}</p>
            <p className="text-black">Admission Year: {student.admission_year}</p>
            {student.graduation_year && <p className="text-black">Graduation Year: {student.graduation_year}</p>}
            {/* <p className="text-black">Department ID: {faculty.department_id}</p> */}
            <div className="flex py-2 align-center justify-between">
              <button
                onClick={() => router.push(`/students/${id}/update`)}
                className="w-[49%] h-10 py-2 px-3 bg-yellow-500 text-md text-white font-semibold rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                Edit Student
              </button>
              <button
                onClick={() => deleteStudent()}
                className="w-[49%] h-10 py-2 px-3 bg-red-500 text-md text-white font-semibold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Delete Student
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
