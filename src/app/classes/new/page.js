"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Building, Users, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function AssignCourse() {
  useRestrictToUserType(["admin"])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [courses, setCourses] = useState([])
  const [faculties, setFaculties] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const [coursesResponse, facultiesResponse, departmentsResponse] = await Promise.all([
          fetch("/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/faculties", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/departments", { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const coursesData = await coursesResponse.json()
        const facultiesData = await facultiesResponse.json()
        const departmentsData = await departmentsResponse.json()

        if (coursesResponse.ok && facultiesResponse.ok && departmentsResponse.ok) {
          setCourses(coursesData.courses || [])
          setFaculties(facultiesData.faculty || [])
          setDepartments(departmentsData.departments || [])
        } else {
          setError("Failed to load data.")
        }
      } catch (error) {
        setError("Something went wrong while fetching data.")
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    const formData = new FormData(event.target)
    const classData = {
      course_id: Number.parseInt(formData.get("courseId"), 10),
      faculty_id: Number.parseInt(formData.get("facultyId"), 10),
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Course assigned successfully!")
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        setError(data.error || "Something went wrong.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
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

  const filteredCourses = courses.filter((course) => course.department_id === Number.parseInt(selectedDepartment, 10))
  const filteredFaculties = faculties.filter(
    (faculty) => faculty.department_id === Number.parseInt(selectedDepartment, 10),
  )

  return (
    <SidebarProvider>
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Assign Course</h1>
            <p className="text-sm text-muted-foreground">Assign a course to a faculty member</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Status Messages */}
          {success && (
            <Card className="border-green-200 bg-green-50 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-green-600">{success}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-600">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Assignment
              </CardTitle>
              <CardDescription>Select a department, course, and faculty member to create an assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Department Selection */}
                <div className="space-y-2">
                  <Label htmlFor="departmentId" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.department_id} value={department.department_id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Selection */}
                <div className="space-y-2">
                  <Label htmlFor="courseId" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course <span className="text-red-500">*</span>
                  </Label>
                  <Select name="courseId" required disabled={!selectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedDepartment ? "Select a course" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map((course) => (
                        <SelectItem key={course.course_id} value={course.course_id.toString()}>
                          {course.name} (Semester {course.semester}, {course.credits} credits)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDepartment && filteredCourses.length === 0 && (
                    <p className="text-sm text-muted-foreground">No courses available in this department</p>
                  )}
                </div>

                {/* Faculty Selection */}
                <div className="space-y-2">
                  <Label htmlFor="facultyId" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Faculty Member <span className="text-red-500">*</span>
                  </Label>
                  <Select name="facultyId" required disabled={!selectedDepartment}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={selectedDepartment ? "Select a faculty member" : "Select department first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFaculties.map((member) => (
                        <SelectItem key={member.faculty_id} value={member.faculty_id.toString()}>
                          {member.name} ({member.role.replace("_", " ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDepartment && filteredFaculties.length === 0 && (
                    <p className="text-sm text-muted-foreground">No faculty members available in this department</p>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={
                      submitting ||
                      !selectedDepartment ||
                      filteredCourses.length === 0 ||
                      filteredFaculties.length === 0
                    }
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Assigning Course...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Assign Course
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
