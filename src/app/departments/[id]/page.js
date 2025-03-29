"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ViewDepartment() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [hod, setHod] = useState(null);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const roleMapping = {
    "professor": "Professor",
    "assistant_professor": "Assistant Professor",
    "associate_professor": "Associate Professor",
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`/api/departments/${id}`);
        const data = await response.json();
        if (response.ok) {
          setDepartment(data.department);
          setStudentCount(data.studentCount);
          setFacultyCount(data.facultyCount);
          setHod(data.hod);
        } else {
          setError("Department not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching department:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/courses`);
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses);
        } else {
          setError("Failed to load courses.");
        }
      } catch (error) {
        setError("Something went wrong while fetching courses.");
        console.error("Error fetching courses:", error);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/faculties`);
        const data = await response.json();
        if (response.ok) {
          setFaculties(data.faculties);
        } else {
          setError("Failed to load faculty members.");
        }
      } catch (error) {
        setError("Something went wrong while fetching faculties.");
        console.error("Error fetching faculties:", error);
      }
    };

    fetchDepartment();
    fetchCourses();
    fetchFaculties();
  }, [id]);

  const deleteDepartment = async () => {
    try {
      const response = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        router.push("/departments");
      } else {
        setError(data.error || "Failed to delete department.");
      }
    } catch (error) {
      setError("Failed to delete department.");
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-left">
        {department && faculties && courses ? (
          <>
            
            <h2 className="text-2xl font-bold text-black mb-4">Department: {department.name}</h2>
            <p className="text-black">Department HOD: {hod ? hod.name : "None"}</p>
            <p className="text-black">Students: {studentCount}</p>
            <p className="text-black">Faculty: {facultyCount}</p>

            <h3 className="text-xl font-semibold mt-4 text-black">Courses</h3>
            {courses.length > 0 ? (
              <ul className="list-disc list-inside text-black">
                {courses.map((course) => (
                  <li key={course.course_id} className="mt-1 flex justify-between">
                    <span>{course.name} (Credits: {course.credits}, Semester: {course.semester})</span>
                    <button
                      onClick={() => router.push(`/courses/${course.course_id}`)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View&gt;&gt;
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No courses available.</p>
            )}

            <h3 className="text-xl font-semibold mt-4 text-black">Faculty Members</h3>
            {faculties.length > 0 ? (
              <ul className="list-disc list-inside text-black">
                {faculties.map((faculty) => (
                  <li key={faculty.faculty_id} className="mt-1 flex justify-between">
                    <span>{faculty.User.name} ({roleMapping[faculty.role]})</span>
                    <button
                      onClick={() => router.push(`/faculties/${faculty.faculty_id}`)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View&gt;&gt;
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No faculty members found.</p>
            )}

            <div className="flex py-2 align-center justify-between mt-4">
              <button
                onClick={() => router.push(`/departments/${id}/update`)}
                className="w-half h-10 py-2 px-3 bg-yellow-500 text-md text-white font-semibold rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                Edit Department
              </button>
              <button
                onClick={() => deleteDepartment()}
                className="w-half h-10 py-2 px-3 bg-red-500 text-md text-white font-semibold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Delete Department
              </button>
            </div>

            <button
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
            <p className="text-red-500 text-center font-semibold">{error}</p>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
