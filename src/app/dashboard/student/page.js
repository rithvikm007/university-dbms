"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function StudentDashboard() {
  useRestrictToUserType(["student"])
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [attendance, setAttendance] = useState({})
  const [results, setResults] = useState({})
  const [expandedCourses, setExpandedCourses] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState({})
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
              name: data.name || "student",
              email: data.email || "student@university.edu",
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
    if (decodedToken.userType !== "student") {
      router.back()
      return
    }

    const fetchData = async () => {
      try {
        const [coursesRes, enrolledRes] = await Promise.all([
          fetch("/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/students/enrolled-courses", { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (!coursesRes.ok || !enrolledRes.ok) {
          throw new Error("Failed to fetch courses or enrolled data.")
        }

        const coursesData = await coursesRes.json()
        const enrolledData = await enrolledRes.json()

        setCourses(coursesData.courses)
        const enrolledIds = enrolledData.courses.map((c) => c.course_id)
        setEnrolledCourses(enrolledIds)

        const attendanceData = {}
        const resultsData = {}

        await Promise.all(
          enrolledIds.map(async (id) => {
            const [attRes, resRes] = await Promise.all([
              fetch(`/api/students/${id}/attendance`, { headers: { Authorization: `Bearer ${token}` } }),
              fetch(`/api/students/${id}/results`, { headers: { Authorization: `Bearer ${token}` } }),
            ])

            if (attRes.ok) {
              const attData = await attRes.json()
              attendanceData[id] = attData.attendance || []
            }
            if (resRes.ok) {
              const resData = await resRes.json()
              if (resData && resData.results) {
                resData.results.forEach((result) => {
                  const courseId = result.Exam.course_id
                  if (!resultsData[courseId]) {
                    resultsData[courseId] = []
                  }
                  if (!resultsData[courseId].some((r) => r.exam_id === result.exam_id)) {
                    resultsData[courseId].push(result)
                  }
                })
              }
            }
          }),
        )

        setAttendance(attendanceData)
        setResults(resultsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }

  const enrollInCourse = async (courseId) => {
    setLoadingCourses((prev) => ({ ...prev, [courseId]: true }))
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      })
      const data = await response.json()

      if (response.ok) {
        setEnrolledCourses([...enrolledCourses, courseId])
      } else {
        setError(data.error || "Enrollment failed.")
      }
    } catch (error) {
      setError("Something went wrong.")
      console.error("Error enrolling in course:", error)
    } finally {
      setLoadingCourses((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const calculateAttendancePercentage = (courseId) => {
    const courseAttendance = Object.values(attendance)
      .flat()
      .filter((record) => record.course_id === courseId)

    if (courseAttendance.length === 0) return 0

    const presentCount = courseAttendance.filter((record) => record.status === "Present").length
    return Math.round((presentCount / courseAttendance.length) * 100)
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

  const enrolledCourseData = courses.filter((course) => enrolledCourses.includes(course.course_id))
  const availableCourseData = courses.filter((course) => !enrolledCourses.includes(course.course_id))

  return (
    <SidebarProvider>
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-lg font-semibold">Hi, {user.name}</h1>
          <p className="text-sm text-muted-foreground">Track your academic progress</p>
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
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Academic Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledCourseData.reduce((sum, course) => sum + course.credits, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledCourseData.length > 0
                  ? Math.round(
                      enrolledCourseData.reduce(
                        (sum, course) => sum + calculateAttendancePercentage(course.course_id),
                        0,
                      ) / enrolledCourseData.length,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fall 2024</div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Enrolled Courses
            </CardTitle>
            <CardDescription>Your current courses with attendance and exam results</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledCourseData.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourseData.map((course) => {
                  const attendancePercentage = calculateAttendancePercentage(course.course_id)
                  const isExpanded = expandedCourses[course.course_id]

                  return (
                    <Card key={course.course_id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span>Credits: {course.credits}</span>
                              <span>•</span>
                              <span>Semester: {course.semester}</span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={attendancePercentage >= 75 ? "default" : "destructive"}>
                              {attendancePercentage}% Attendance
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => toggleCourseExpansion(course.course_id)}>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Attendance Section */}
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Attendance Record
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Attendance Rate</span>
                                  <span>{attendancePercentage}%</span>
                                </div>
                                <Progress value={attendancePercentage} className="h-2" />
                              </div>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {Object.values(attendance)
                                  .flat()
                                  .filter(
                                    (record, index, self) =>
                                      record.course_id === course.course_id &&
                                      index ===
                                        self.findIndex(
                                          (r) => r.course_id === record.course_id && r.date === record.date,
                                        ),
                                  )
                                  .map((record, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm py-1">
                                      <span>{new Date(record.date).toLocaleDateString()}</span>
                                      <Badge
                                        variant={record.status === "Present" ? "default" : "destructive"}
                                        className="text-xs"
                                      >
                                        {record.status === "Present" ? (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {record.status}
                                      </Badge>
                                    </div>
                                  ))}
                                {Object.values(attendance)
                                  .flat()
                                  .filter((record) => record.course_id === course.course_id).length === 0 && (
                                  <p className="text-sm text-muted-foreground">No attendance records available.</p>
                                )}
                              </div>
                            </div>

                            {/* Exam Results Section */}
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Exam Results
                              </h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {results[course.course_id]?.length ? (
                                  results[course.course_id].map((exam, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                                    >
                                      <div>
                                        <div className="font-medium">{exam.Exam.type}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(exam.Exam.date).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">{exam.marks} marks</div>
                                        <Badge variant="outline" className="text-xs">
                                          Grade: {exam.grade}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No exam results available.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Available Courses
            </CardTitle>
            <CardDescription>Courses you can enroll in for the current semester</CardDescription>
          </CardHeader>
          <CardContent>
            {availableCourseData.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No available courses to enroll in.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableCourseData.map((course) => (
                  <Card key={course.course_id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{course.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Credits: {course.credits} • Semester: {course.semester}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{course.semester}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => enrollInCourse(course.course_id)}
                        disabled={loadingCourses[course.course_id]}
                        className="w-full"
                        size="sm"
                      >
                        {loadingCourses[course.course_id] ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
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
