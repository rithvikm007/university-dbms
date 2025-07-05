"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { BookOpen, Calendar, Users, ClipboardList, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function FacultyDashboard() {
  useRestrictToUserType(["faculty"])
  const [courses, setCourses] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [scheduling, setScheduling] = useState({ courseId: null, date: "" })
  const [examScheduling, setExamScheduling] = useState({ courseId: null, date: "", type: "" })
  const router = useRouter()
  const [id, setId] = useState(null)
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const decoded = jwtDecode(token)
      
        // Fetch user details
        fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser({
              name: data.name || "faculty",
              email: data.email || "faculty@university.edu",
            })
          })
          .catch((err) => {
            console.error("Error fetching user details:", err)
          })
      
    } catch (err) {
      console.error("Invalid token:", err)
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const decodedToken = jwtDecode(token)
    setId(decodedToken.userId)

    const fetchAssignedCourses = async () => {
      try {
        const response = await fetch("/api/faculties/courses", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setCourses(data.courses)
        } else {
          setError(data.error || "Failed to fetch courses.")
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedCourses()
  }, [router])

  const handleScheduleClassSubmit = async () => {
    if (!scheduling.date) {
      setError("Please select a date.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/faculties/schedule-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: scheduling.courseId,
          date: scheduling.date,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Class scheduled successfully!")
        setScheduling({ courseId: null, date: "" })
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to schedule class.")
      }
    } catch (error) {
      console.error("Error scheduling class:", error)
      setError("Something went wrong.")
    }
  }

  const handleScheduleExamSubmit = async () => {
    if (!examScheduling.date || !examScheduling.type) {
      setError("Please select a date and exam type.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/faculties/schedule-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: examScheduling.courseId,
          date: examScheduling.date,
          type: examScheduling.type,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Exam scheduled successfully!")
        setExamScheduling({ courseId: null, date: "", type: "" })
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to schedule exam.")
      }
    } catch (error) {
      console.error("Error scheduling exam:", error)
      setError("Something went wrong.")
    }
  }

  if (loading) {
    return (
        <SidebarProvider>
      <SidebarInset>
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-lg font-semibold">Hi, {user.name}</h1>
          <p className="text-sm text-muted-foreground">Manage your courses and students</p>
        </div>
        <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
            }}
            >
            Logout
        </Button>

      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Status Messages */}
        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-green-600">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Semester</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fall 2024</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Assigned Courses
            </CardTitle>
            <CardDescription>Manage your courses, schedule classes, and track student progress</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assigned courses found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.course_id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{course.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span>Credits: {course.credits}</span>
                            <span>•</span>
                            <span>Semester: {course.semester}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{course.semester}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/classes/${course.course_id}/${id}`)}
                          className="justify-start gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setScheduling({ courseId: course.course_id, date: "" })}
                          className="justify-start gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Schedule Class
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExamScheduling({ courseId: course.course_id, date: "", type: "" })}
                          className="justify-start gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          Schedule Exam
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/faculty/attendance/${course.course_id}`)}
                          className="justify-start gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Take Attendance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/faculty/exam-results/${course.course_id}`)}
                          className="justify-start gap-2"
                        >
                          <ClipboardList className="h-4 w-4" />
                          Record Results
                        </Button>
                      </div>

                      {/* Schedule Class Form */}
                      {scheduling.courseId === course.course_id && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Schedule Class</h4>
                          <div className="flex gap-2">
                            <Input
                              type="date"
                              value={scheduling.date}
                              onChange={(e) => setScheduling({ ...scheduling, date: e.target.value })}
                              className="flex-1"
                            />
                            <Button onClick={handleScheduleClassSubmit} size="sm">
                              Schedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setScheduling({ courseId: null, date: "" })}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Schedule Exam Form */}
                      {examScheduling.courseId === course.course_id && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Schedule Exam</h4>
                          <div className="flex gap-2">
                            <Input
                              type="date"
                              value={examScheduling.date}
                              onChange={(e) => setExamScheduling({ ...examScheduling, date: e.target.value })}
                              className="flex-1"
                            />
                            <Select
                              value={examScheduling.type}
                              onValueChange={(value) => setExamScheduling({ ...examScheduling, type: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Midterm">Midterm</SelectItem>
                                <SelectItem value="Final">Final</SelectItem>
                                <SelectItem value="Quiz">Quiz</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleScheduleExamSubmit} size="sm">
                              Schedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExamScheduling({ courseId: null, date: "", type: "" })}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
