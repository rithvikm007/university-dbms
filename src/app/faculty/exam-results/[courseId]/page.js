"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FileText, Users, Trophy, ChevronUp, Loader2, AlertCircle, CheckCircle2, GraduationCap } from "lucide-react"

export default function ExamResultsPage() {
  const router = useRouter()
  const { courseId } = useParams()
  const [exams, setExams] = useState([])
  const [expandedExam, setExpandedExam] = useState(null)
  const [students, setStudents] = useState({})
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submittedExamId, setSubmittedExamId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchScheduledExams = async () => {
      try {
        const response = await fetch(`/api/faculties/exams/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (response.ok) {
          const sortedExams = data.exams.sort((a, b) => new Date(a.date) - new Date(b.date))
          setExams(sortedExams)
        } else {
          setError(data.error || "Failed to fetch scheduled exams.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching scheduled exams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScheduledExams()
  }, [courseId, router])

  const toggleExam = async (examId) => {
    if (expandedExam === examId) {
      setExpandedExam(null)
      return
    }
    setExpandedExam(examId)

    if (!students[examId]) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/faculties/students/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (response.ok) {
          setStudents((prev) => ({ ...prev, [examId]: data.students }))
          setResults((prev) => ({
            ...prev,
            [examId]: data.students.reduce((acc, student) => {
              acc[student.id] = { marks: "", grade: "" }
              return acc
            }, {}),
          }))
        } else {
          console.error("Error fetching students:", data.error)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }
  }

  const handleResultChange = (examId, studentId, field, value) => {
    setResults((prev) => ({
      ...prev,
      [examId]: {
        ...prev[examId],
        [studentId]: { ...prev[examId][studentId], [field]: value },
      },
    }))
  }

  const submitResults = async (examId) => {
    setSubmittedExamId(examId)
    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/faculties/exam-results/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, results: results[examId] }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Exam results recorded successfully!")
        setTimeout(() => {
          setSuccess("")
          setSubmittedExamId(null)
        }, 3000)
        setExpandedExam(null)
      } else {
        setError(data.error || "Failed to submit results.")
        console.error("Error submitting results:", data.error)
      }
    } catch (error) {
      setError("Something went wrong.")
      console.error("Error submitting results:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const getExamTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "midterm":
        return "bg-blue-100 text-blue-800"
      case "final":
        return "bg-red-100 text-red-800"
      case "quiz":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case "S":
      case "A":
        return "text-green-600"
      case "B":
      case "C":
        return "text-blue-600"
      case "D":
      case "E":
        return "text-yellow-600"
      case "F":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/faculty">Faculty Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Exam Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Exam Results Management</h1>
              <p className="text-muted-foreground">Record and manage exam results for your courses</p>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{exams.length} scheduled exams</span>
            </div>
          </div>

          {success && submittedExamId && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : exams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Scheduled Exams</h3>
                <p className="text-muted-foreground text-center">There are no scheduled exams for this course yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.exam_id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">
                              {new Date(exam.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </CardTitle>
                            <Badge className={getExamTypeColor(exam.type)}>{exam.type}</Badge>
                          </div>
                          <CardDescription>Exam Date: {exam.date}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => toggleExam(exam.exam_id)}
                        className="flex items-center gap-2"
                      >
                        {expandedExam === exam.exam_id ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Students
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4" />
                            Record Results
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedExam === exam.exam_id && (
                    <CardContent className="pt-0">
                      {students[exam.exam_id] ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {students[exam.exam_id].length} students enrolled
                          </div>

                          <div className="grid gap-3">
                            {students[exam.exam_id].map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">{student.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">{student.name}</span>
                                    <p className="text-sm text-muted-foreground">Student ID: {student.id}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Marks</label>
                                    <Input
                                      type="number"
                                      placeholder="0-100"
                                      className="w-20 h-8 text-center"
                                      value={results[exam.exam_id]?.[student.id]?.marks || ""}
                                      onChange={(e) =>
                                        handleResultChange(exam.exam_id, student.id, "marks", e.target.value)
                                      }
                                      min="0"
                                      max="100"
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">Grade</label>
                                    <Select
                                      value={results[exam.exam_id]?.[student.id]?.grade || ""}
                                      onValueChange={(value) =>
                                        handleResultChange(exam.exam_id, student.id, "grade", value)
                                      }
                                    >
                                      <SelectTrigger className="w-16 h-8">
                                        <SelectValue placeholder="--" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {["S", "A", "B", "C", "D", "E", "F", "W", "P"].map((grade) => (
                                          <SelectItem key={grade} value={grade}>
                                            <span className={getGradeColor(grade)}>{grade}</span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end pt-4 border-t">
                            <Button
                              onClick={() => submitResults(exam.exam_id)}
                              disabled={submitting}
                              className="flex items-center gap-2"
                            >
                              {submitting && submittedExamId === exam.exam_id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Trophy className="h-4 w-4" />
                                  Submit Results
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
