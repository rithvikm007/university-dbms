"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Plus, Building2, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function Courses() {
  useRestrictToUserType(["admin"])
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([fetch("/api/departments"), fetch("/api/courses")])

        const [deptData, courseData] = await Promise.all([deptRes.json(), courseRes.json()])

        if (deptRes.ok && courseRes.ok) {
          setDepartments(deptData.departments)
          setCourses(courseData.courses)
        } else {
          setError("Failed to load data.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Organizing courses under their respective departments
  const departmentCoursesMap = departments.reduce((acc, dept) => {
    acc[dept.department_id] = {
      name: dept.name,
      courses: [],
    }
    return acc
  }, {})

  courses.forEach((course) => {
    if (course.department_id && departmentCoursesMap[course.department_id]) {
      departmentCoursesMap[course.department_id].courses.push(course)
    }
  })

  // Filter departments and courses based on search term
  const filteredDepartments = departments.filter((dept) => {
    const deptMatches = dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    const courseMatches = departmentCoursesMap[dept.department_id]?.courses.some((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return deptMatches || courseMatches
  })

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("userType") === "admin"

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
              <p className="text-muted-foreground">Manage courses organized by departments</p>
            </div>
            {isAdmin && (
              <Button onClick={() => router.push("/courses/new")} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-destructive">{error}</p>
              </CardContent>
            </Card>
          ) : filteredDepartments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "No departments or courses available"}
                </p>
                {isAdmin && !searchTerm && (
                  <Button onClick={() => router.push("/courses/new")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Course
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredDepartments.map((dept) => {
                const deptCourses = departmentCoursesMap[dept.department_id]?.courses || []
                const filteredCourses = searchTerm
                  ? deptCourses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  : deptCourses

                return (
                  <Card key={dept.department_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{dept.name}</CardTitle>
                            <CardDescription>
                              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {filteredCourses.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredCourses.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {filteredCourses.map((course) => (
                            <Card
                              key={course.course_id}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => router.push(`/courses/${course.course_id}`)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <h4 className="font-medium text-sm">{course.name}</h4>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Credits: {course.credits}</span>
                                  <span>Semester: {course.semester}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            {searchTerm ? "No courses match your search" : "No courses in this department"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
