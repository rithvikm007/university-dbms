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
  const [students, setStudents] = useState([]);
  const [searchStudents, setSearchStudents] = useState("");
  const [searchCourses, setSearchCourses] = useState("");
  const [searchFaculties, setSearchFaculties] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const roleMapping = {
    professor: "Professor",
    assistant_professor: "Assistant Professor",
    associate_professor: "Associate Professor",
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

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/students`);
        const data = await response.json();
        if (response.ok) {
          setStudentCount(data.studentCount);
          setStudents(data.students);
        } else {
          setError("Failed to load students.");
        }
      } catch (error) {
        setError("Something went wrong while fetching students.");
        console.error("Error fetching students:", error);
      }
    };

    fetchDepartment();
    fetchCourses();
    fetchFaculties();
    fetchStudents();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl w-full">
        {department && faculties && courses && students ? (
          <>
            <h2 className="text-3xl font-bold text-black mb-4">{department.name}</h2>
            <p className="text-lg text-black">HOD: {hod ? hod.name : "None"}</p>
            <p className="text-lg text-black">Students: {studentCount}</p>
            <p className="text-lg text-black">Faculty: {facultyCount}</p>

            {/* Grid Layout for Students, Courses, Faculty */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Students Section */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md w-full h-64 overflow-y-auto">
                <h3 className="text-xl font-semibold text-black">Students</h3>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full text-black p-2 border border-gray-300 rounded mt-2"
                  value={searchStudents}
                  onChange={(e) => setSearchStudents(e.target.value)}
                />
                {students.length > 0 ? (
                  <ul className="list-disc list-inside text-black">
                    {students.filter(s => s.User.name.toLowerCase().includes(searchStudents.toLowerCase())).length > 0 ? (
                    students.filter(s => s.User.name.toLowerCase().includes(searchStudents.toLowerCase())).map(student => (
                      <li key={student.student_id} className="mt-1 flex justify-between">
                        <span>{student.User.name} ({student.User.email})</span>
                        <button
                          onClick={() => router.push(`/students/${student.student_id}`)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          View&gt;&gt;
                        </button>
                      </li>
                    ))
                    ) : (
                      <p className="text-black mt-1">No students found.</p>
                    )}
                  </ul>
                ) : (
                  <p className="text-black mt-1">No students available.</p>
                )}
              </div>

              {/* Courses Section */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md w-full h-64 overflow-y-auto">
                <h3 className="text-xl font-semibold text-black">Courses</h3>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full text-black p-2 border border-gray-300 rounded mt-2"
                  value={searchCourses}
                  onChange={(e) => setSearchCourses(e.target.value)}
                />
                {courses.length > 0 ? (
                  <ul className="list-disc list-inside text-black">
                    {courses.filter(c => c.name.toLowerCase().includes(searchCourses.toLowerCase())).length > 0 ?(
                    courses.filter(c => c.name.toLowerCase().includes(searchCourses.toLowerCase())).map(course => (
                      <li key={course.course_id} className="mt-1 flex justify-between">
                        <span>{course.name} (Credits: {course.credits})</span>
                        <button
                          onClick={() => router.push(`/courses/${course.course_id}`)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          View&gt;&gt;
                        </button>
                      </li>
                    ))
                    ) : (
                      <p className="text-black mt-1">No courses found.</p>
                    )}
                  </ul>
                ) : (
                  <p className="text-black mt-1">No courses available.</p>
                )}
              </div>

              {/* Faculty Section */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md w-full h-64 overflow-y-auto">
                <h3 className="text-xl font-semibold text-black">Faculty Members</h3>
                <input
                  type="text"
                  placeholder="Search faculty..."
                  className="w-full text-black p-2 border border-gray-300 rounded mt-2"
                  value={searchFaculties}
                  onChange={(e) => setSearchFaculties(e.target.value)}
                />
                {faculties.length > 0 ? (
                  <ul className="list-disc list-inside text-black">
                    {faculties.filter(f => f.User.name.toLowerCase().includes(searchFaculties.toLowerCase())).length > 0 ? (
                    faculties.filter(f => f.User.name.toLowerCase().includes(searchFaculties.toLowerCase())).map(faculty => (
                      <li key={faculty.faculty_id} className="mt-1 flex justify-between">
                        <span>{faculty.User.name} ({roleMapping[faculty.role]})</span>
                        <button
                          onClick={() => router.push(`/faculties/${faculty.faculty_id}`)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          View&gt;&gt;
                        </button>
                      </li>
                    ))
                    ) : (
                      <p className="text-black mt-1">No faculty members found.</p>
                    )}

                  </ul>
                ) : (
                  <p className="text-black mt-1">No faculty members found.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
            <button
                onClick={() => router.back()}
                className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 block"
                >
                Go Back
              </button>
              <button
                onClick={() => router.push(`/departments/${id}/update`)}
                className="py-2 px-6 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={deleteDepartment}
                className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
