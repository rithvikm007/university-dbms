"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ChevronUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

export default function AttendancePage() {
  const router = useRouter()
  const { courseId } = useParams()
  const [sessions, setSessions] = useState([])
  const [expandedSession, setExpandedSession] = useState(null)
  const [students, setStudents] = useState({})
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchScheduledSessions = async () => {
      try {
        const response = await fetch(`/api/faculties/scheduled-classes/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          const groupedByDate = Array.from(new Set(data.sessions.map((session) => session.date)))
            .map((date) => ({ date }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
          setSessions(groupedByDate)
        } else {
          setError(data.error || "Failed to fetch scheduled sessions.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching scheduled sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScheduledSessions()
  }, [courseId, router])

  const toggleSession = async (date) => {
    if (expandedSession === date) {
      setExpandedSession(null)
      return
    }

    setExpandedSession(date)

    if (!students[date]) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/faculties/students/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setStudents((prev) => ({ ...prev, [date]: data.students }))
          setAttendance((prev) => ({
            ...prev,
            [date]: data.students.reduce((acc, student) => {
              acc[student.id] = "Present"
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

  const handleAttendanceChange = (date, studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: { ...prev[date], [studentId]: status },
    }))
  }

  const submitAttendance = async (date) => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/faculties/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          date,
          attendance: attendance[date],
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Attendance submitted successfully!")
        setError("")
        setExpandedSession(null)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        console.error("Error submitting attendance:", data.error)
        setError(data.error || "Failed to submit attendance.")
        setSuccess("")
      }
    } catch (error) {
      console.error("Error submitting attendance:", error)
      setError("Something went wrong.")
      setSuccess("")
    } finally {
      setSubmitting(false)
    }
  }

  const getAttendanceIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Late":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getAttendanceBadgeVariant = (status) => {
    switch (status) {
      case "Present":
        return "default"
      case "Absent":
        return "destructive"
      case "Late":
        return "secondary"
      default:
        return "default"
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
                <BreadcrumbPage>Attendance Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
              <p className="text-muted-foreground">Mark attendance for scheduled sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{sessions.length} scheduled sessions</span>
            </div>
          </div>

          {success && (
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
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Scheduled Sessions</h3>
                <p className="text-muted-foreground text-center">
                  There are no scheduled sessions for this course yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => (
                <Card key={session.date} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardTitle>
                          <CardDescription>Session Date: {session.date}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => toggleSession(session.date)}
                        className="flex items-center gap-2"
                      >
                        {expandedSession === session.date ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Students
                          </>
                        ) : (
                          <>
                            <Users className="h-4 w-4" />
                            Mark Attendance
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedSession === session.date && (
                    <CardContent className="pt-0">
                      {students[session.date] ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {students[session.date].length} students enrolled
                          </div>

                          <div className="grid gap-3">
                            {students[session.date].map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">{student.name.charAt(0)}</span>
                                  </div>
                                  <span className="font-medium">{student.name}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {getAttendanceIcon(attendance[session.date]?.[student.id])}
                                  <Select
                                    value={attendance[session.date]?.[student.id] || "Present"}
                                    onValueChange={(value) => handleAttendanceChange(session.date, student.id, value)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Present">Present</SelectItem>
                                      <SelectItem value="Absent">Absent</SelectItem>
                                      <SelectItem value="Late">Late</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end pt-4 border-t">
                            <Button
                              onClick={() => submitAttendance(session.date)}
                              disabled={submitting}
                              className="flex items-center gap-2"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Submit Attendance
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
