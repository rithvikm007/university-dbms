"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, BookOpen, User, Building2, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

export default function ClassPage() {
  const { course_id, faculty_id } = useParams()
  const router = useRouter()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchClass() {
      try {
        const res = await fetch(`/api/classes/${course_id}/${faculty_id}`)
        if (!res.ok) throw new Error("Class not found")

        const data = await res.json()
        setClassData(data)
      } catch (error) {
        console.error("Error fetching class:", error)
        setError("Class not found.")
        setClassData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchClass()
  }, [course_id, faculty_id])

  const deleteClass = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/classes/${course_id}/${faculty_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Class deleted successfully!")
        setTimeout(() => router.push("/classes"), 1500)
      } else {
        setError("Failed to delete class.")
      }
    } catch (error) {
      console.error("Error deleting class:", error)
      setError("Failed to delete class.")
    } finally {
      setIsDeleting(false)
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/classes">Classes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Class Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Class Details</h1>
              <p className="text-muted-foreground">View and manage class information</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && !classData && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {classData ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Course Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Course Name</label>
                    <p className="text-lg font-semibold">{classData.course.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{classData.course.department}</span>
                    </div>
                  </div>
                  {classData.course.credits && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Credits</label>
                      <Badge variant="secondary" className="mt-1">
                        {classData.course.credits} Credits
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Faculty Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Faculty Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Faculty Name</label>
                    <p className="text-lg font-semibold">{classData.faculty.name}</p>
                  </div>
                  {classData.faculty.email && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm text-muted-foreground">{classData.faculty.email}</p>
                    </div>
                  )}
                  {classData.faculty.department && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Faculty Department</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{classData.faculty.department}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Class Status */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Class Status</CardTitle>
                  <CardDescription>Current status and management options for this class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active Class
                      </Badge>
                      <span className="text-sm text-muted-foreground">This class is currently active and assigned</span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete Class"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the class assignment between{" "}
                            <strong>{classData.course.name}</strong> and <strong>{classData.faculty.name}</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteClass} className="bg-red-600 hover:bg-red-700">
                            Delete Class
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            !error && (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Class Not Found</h3>
                    <p className="text-muted-foreground mb-4">The requested class could not be found.</p>
                    <Button onClick={() => router.push("/classes")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Classes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
