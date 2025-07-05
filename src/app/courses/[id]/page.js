"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { BookOpen, Building2, Calendar, CreditCard, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function ViewCourse() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [department, setDepartment] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`)
        const data = await response.json()

        if (response.ok) {
          setCourse(data.course)
          setDepartment(data.department)
        } else {
          setError("Course not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const deleteCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (response.ok) {
        router.push("/courses")
      } else {
        setError(data.error || "Failed to delete course.")
      }
    } catch (error) {
      setError("Failed to delete course.")
      console.error("Error deleting course:", error)
    }
  }

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
                  <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course?.name || "Course Details"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          ) : course ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
                    <p className="text-muted-foreground">Course Details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  {isAdmin && (
                    <>
                      <Button onClick={() => router.push(`/courses/${id}/update`)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.name}"? This action cannot be undone and will
                              remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={deleteCourse}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Course
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>

              {/* Course Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Course Name</span>
                      <span className="text-sm text-muted-foreground">{course.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Credits</span>
                      <Badge variant="secondary" className="gap-1">
                        <CreditCard className="h-3 w-3" />
                        {course.credits}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Semester</span>
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {course.semester}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Department Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Department</span>
                      <span className="text-sm text-muted-foreground">
                        {course.Department ? course.Department.name : "Unknown"}
                      </span>
                    </div>
                    {course.Department && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/departments/${course.Department.department_id}`)}
                        className="w-full gap-2"
                      >
                        <Building2 className="h-4 w-4" />
                        View Department
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {error && (
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <p className="text-destructive text-center font-medium">{error}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
