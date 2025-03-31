"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ExamResultsPage() {
    const router = useRouter();
    const { courseId } = useParams();
    const [exams, setExams] = useState([]);
    const [expandedExam, setExpandedExam] = useState(null);
    const [students, setStudents] = useState({});
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submittedExams, setSubmittedExams] = useState({});
    const [success, setSuccess] = useState("");
    const [submittedExamId, setSubmittedExamId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScheduledExams = async () => {
            try {
                const response = await fetch(`/api/faculties/exams/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setExams(data.exams);
                } else {
                    setError(data.error || "Failed to fetch scheduled exams.");
                }
                setLoading(false);
            } catch (error) {
                setError("Something went wrong.");
                console.error("Error fetching scheduled exams:", error);
                setLoading(false);
            }
        };

        fetchScheduledExams();
    }, [courseId]);

    const toggleExam = async (examId) => {
        if (expandedExam === examId) {
            setExpandedExam(null);
            return;
        }
        setExpandedExam(examId);

        if (!students[examId]) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`/api/faculties/students/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setStudents((prev) => ({ ...prev, [examId]: data.students }));
                    setResults((prev) => ({
                        ...prev,
                        [examId]: data.students.reduce((acc, student) => {
                            acc[student.id] = { marks: "", grade: "" };
                            return acc;
                        }, {}),
                    }));
                    setErrors((prev) => ({ ...prev, [examId]: {} }));
                } else {
                    console.error("Error fetching students:", data.error);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    const handleResultChange = (examId, studentId, field, value) => {
        setResults((prev) => ({
            ...prev,
            [examId]: {
                ...prev[examId],
                [studentId]: { ...prev[examId][studentId], [field]: value },
            },
        }));
    };

    const submitResults = async (examId) => {
        setSubmittedExamId(examId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/faculties/exam-results/record`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ examId, results: results[examId] }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Exam results recorded successfully!");
                setTimeout(() => setSuccess(""), 3000);
                setExpandedExam(null);
                setSubmittedExams((prev) => ({ ...prev, [examId]: false }));
            } else {
                console.error("Error submitting results:", data.error);
            }
        } catch (error) {
            console.error("Error submitting results:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Scheduled Exams</h2>
                {loading ? <Loading /> : error ? <p className="text-red-500 text-center">{error}</p> : (
                    <ul className="space-y-4">
                        {exams.map((exam) => (
                            <li key={exam.exam_id} className="p-4 bg-gray-200 text-black rounded-lg shadow">
                                {submittedExamId === exam.exam_id && success && <p className="text-green-500 text-center">{success}</p>}
                                <p className="text-lg font-semibold">Date: {exam.date}</p>
                                <p>Type: {exam.type}</p>
                                <button
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                    onClick={() => toggleExam(exam.exam_id)}
                                >
                                    {expandedExam === exam.exam_id ? "Hide Students" : "Record Results"}
                                </button>

                                {expandedExam === exam.exam_id && students[exam.exam_id] && (
                                    <div className="mt-4">
                                        <ul className="space-y-2">
                                            {students[exam.exam_id].map((student) => (
                                                <li key={student.id} className="flex flex-col bg-white p-2 rounded-md shadow">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-black">{student.name}</p>
                                                        <input
                                                            type="number"
                                                            placeholder="Marks"
                                                            className="border p-2 rounded-md text-black w-20"
                                                            value={results[exam.exam_id][student.id]?.marks || ""}
                                                            onChange={(e) => handleResultChange(exam.exam_id, student.id, "marks", e.target.value)}
                                                        />
                                                        <select
                                                            className="border p-2 rounded-md text-black w-16"
                                                            value={results[exam.exam_id][student.id]?.grade || ""}
                                                            onChange={(e) => handleResultChange(exam.exam_id, student.id, "grade", e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            {["S", "A", "B", "C", "D", "E", "F", "W", "P"].map((grade) => (
                                                                <option key={grade} value={grade}>{grade}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            onClick={() => submitResults(exam.exam_id)}
                                        >
                                            Submit Results
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={() => router.back()}
                    className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
