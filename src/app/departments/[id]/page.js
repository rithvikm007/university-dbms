"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Building2, Users, UserCheck, BookOpen, Search, Edit, Trash2, ArrowLeft, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Loading from "@/app/components/loading"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function ViewDepartment() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [department, setDepartment] = useState(null)
  const [studentCount, setStudentCount] = useState(0)
  const [facultyCount, setFacultyCount] = useState(0)
  const [hod, setHod] = useState(null)
  const [courses, setCourses] = useState([])
  const [faculties, setFaculties] = useState([])
  const [students, setStudents] = useState([])
  const [searchStudents, setSearchStudents] = useState("")
  const [searchCourses, setSearchCourses] = useState("")
  const [searchFaculties, setSearchFaculties] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const roleMapping = {
    professor: "Professor",
    assistant_professor: "Assistant Professor",
    associate_professor: "Associate Professor",
  }

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`/api/departments/${id}`)
        const data = await response.json()
        if (response.ok) {
          setDepartment(data.department)
          setStudentCount(data.studentCount)
          setFacultyCount(data.facultyCount)
          setHod(data.hod)
        } else {
          setError("Department not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching department:", error)
      }
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/courses`)
        const data = await response.json()
        if (response.ok) {
          setCourses(data.courses)
        } else {
          setError("Failed to load courses.")
        }
      } catch (error) {
        setError("Something went wrong while fetching courses.")
        console.error("Error fetching courses:", error)
      }
    }

    const fetchFaculties = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/faculties`)
        const data = await response.json()
        if (response.ok) {
          setFaculties(data.faculties)
        } else {
          setError("Failed to load faculty members.")
        }
      } catch (error) {
        setError("Something went wrong while fetching faculties.")
        console.error("Error fetching faculties:", error)
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/students`)
        const data = await response.json()
        if (response.ok) {
          setStudentCount(data.studentCount)
          setStudents(data.students)
        } else {
          setError("Failed to load students.")
        }
      } catch (error) {
        setError("Something went wrong while fetching students.")
        console.error("Error fetching students:", error)
      }
    }

    Promise.all([fetchDepartment(), fetchCourses(), fetchFaculties(), fetchStudents()]).finally(() => setLoading(false))
  }, [id])

  const deleteDepartment = async () => {
    try {
      const response = await fetch(`/api/departments/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (response.ok) {
        router.push("/departments")
      } else {
        setError(data.error || "Failed to delete department.")
      }
    } catch (error) {
      setError("Failed to delete department.")
      console.error("Error deleting department:", error)
    }
  }

  const filteredStudents = students.filter((s) => s.User.name.toLowerCase().includes(searchStudents.toLowerCase()))

  const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(searchCourses.toLowerCase()))

  const filteredFaculties = faculties.filter((f) => f.User.name.toLowerCase().includes(searchFaculties.toLowerCase()))

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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{department?.name || "Department Details"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {department ? (
            <>
              {/* Department Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Building2 className="h-8 w-8" />
                    {department.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>HOD: {hod ? hod.name : "Not Assigned"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{studentCount} Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4" />
                      <span>{facultyCount} Faculty</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => router.push(`/departments/${id}/update`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the department
                          <strong> {department.name}</strong> and all associated data including students, faculty, and
                          courses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteDepartment}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Department
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Students Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Students</span>
                      </div>
                      <Badge variant="secondary">{filteredStudents.length}</Badge>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchStudents}
                        onChange={(e) => setSearchStudents(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      <div className="space-y-2">
                        {filteredStudents.map((student) => (
                          <div
                            key={student.student_id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{student.User.name}</p>
                              <p className="text-xs text-muted-foreground">{student.User.email}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => router.push(`/students/${student.student_id}`)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {searchStudents ? "No students found." : "No students available."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Courses Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Courses</span>
                      </div>
                      <Badge variant="secondary">{filteredCourses.length}</Badge>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        value={searchCourses}
                        onChange={(e) => setSearchCourses(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    {filteredCourses.length > 0 ? (
                      <div className="space-y-2">
                        {filteredCourses.map((course) => (
                          <div
                            key={course.course_id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{course.name}</p>
                              <p className="text-xs text-muted-foreground">Credits: {course.credits}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => router.push(`/courses/${course.course_id}`)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {searchCourses ? "No courses found." : "No courses available."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Faculty Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5" />
                        <span>Faculty</span>
                      </div>
                      <Badge variant="secondary">{filteredFaculties.length}</Badge>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search faculty..."
                        value={searchFaculties}
                        onChange={(e) => setSearchFaculties(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    {filteredFaculties.length > 0 ? (
                      <div className="space-y-2">
                        {filteredFaculties.map((faculty) => (
                          <div
                            key={faculty.faculty_id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{faculty.User.name}</p>
                              <p className="text-xs text-muted-foreground">{roleMapping[faculty.role]}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => router.push(`/faculties/${faculty.faculty_id}`)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {searchFaculties ? "No faculty found." : "No faculty available."}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-destructive">Department Not Found</h3>
                <p className="text-muted-foreground text-center">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
