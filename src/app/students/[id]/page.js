"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Edit,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
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

export default function ViewStudent() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [department, setDepartment] = useState(null)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`)
        const data = await response.json()

        if (response.ok) {
          setStudent(data.student)
        } else {
          setError("Student not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching student:", error)
      }
    }

    fetchStudent()
  }, [id])

  useEffect(() => {
    if (student?.department_id) {
      const fetchDepartment = async () => {
        try {
          const response = await fetch(`/api/departments/${student.department_id}`)
          const data = await response.json()

          if (response.ok) {
            setDepartment(data.department)
          } else {
            setError("Department not found.")
          }
        } catch (error) {
          setError("Something went wrong.")
          console.error("Error fetching department:", error)
        }
      }

      fetchDepartment()
    }
  }, [student])

  const deleteStudent = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/students")
      } else {
        setError(data.error || "Failed to delete student.")
      }
    } catch (error) {
      setError("Failed to delete student.")
      console.error("Error deleting student:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (!student && !error) {
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Student Details</h1>
            <p className="text-sm text-muted-foreground">View and manage student information</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Student Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{student.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Student ID: {student.student_id}</Badge>
                        {department && <Badge variant="outline">{department.name}</Badge>}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/students/${id}/update`)} className="gap-2">
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
                          <AlertDialogTitle>Delete Student</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {student.name}? This action cannot be undone and will remove
                            all associated records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteStudent} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete Student"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>
                  {student.phone_no && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{student.phone_no}</p>
                      </div>
                    </div>
                  )}
                  {student.dob && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{new Date(student.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {department && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{department.name}</p>
                      </div>
                    </div>
                  )}
                  {student.admission_year && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Admission Year</p>
                        <p className="font-medium">{student.admission_year}</p>
                      </div>
                    </div>
                  )}
                  {student.graduation_year && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Graduation</p>
                        <p className="font-medium">{student.graduation_year}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Student Status</CardTitle>
                <CardDescription>Current academic standing and enrollment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active Student
                  </Badge>
                  <Badge variant="outline">Enrolled: {student.admission_year || "N/A"}</Badge>
                  {student.graduation_year && (
                    <Badge variant="outline">Expected Graduation: {student.graduation_year}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
