"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Users,
  User,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  UserCheck,
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

export default function ViewFaculty() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [faculty, setFaculty] = useState(null)
  const [department, setDepartment] = useState(null)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const roleMapping = {
    professor: "Professor",
    associate_professor: "Associate Professor",
    assistant_professor: "Assistant Professor",
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "professor":
        return "default"
      case "associate_professor":
        return "secondary"
      case "assistant_professor":
        return "outline"
      default:
        return "outline"
    }
  }

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/faculties/${id}`)
        const data = await response.json()

        if (response.ok) {
          setFaculty(data.faculty)
        } else {
          setError("Faculty member not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching faculty:", error)
      }
    }

    fetchFaculty()
  }, [id])

  useEffect(() => {
    if (faculty?.department_id) {
      const fetchDepartment = async () => {
        try {
          const response = await fetch(`/api/departments/${faculty.department_id}`)
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
  }, [faculty])

  const deleteFaculty = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/faculties/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/faculties")
      } else {
        setError(data.error || "Failed to delete faculty member.")
      }
    } catch (error) {
      setError("Failed to delete faculty member.")
      console.error("Error deleting faculty:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (!faculty && !error) {
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
            <h1 className="text-lg font-semibold">Faculty Details</h1>
            <p className="text-sm text-muted-foreground">View and manage faculty information</p>
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
            {/* Faculty Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <UserCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{faculty.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Faculty ID: {faculty.faculty_id}</Badge>
                        <Badge variant={getRoleBadgeVariant(faculty.role)}>
                          {roleMapping[faculty.role] || "Unknown Role"}
                        </Badge>
                        {department && <Badge variant="outline">{department.name}</Badge>}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/faculties/${id}/update`)} className="gap-2">
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
                          <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {faculty.name}? This action cannot be undone and will remove
                            all associated records including course assignments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteFaculty} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete Faculty"}
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
                      <p className="font-medium">{faculty.email}</p>
                    </div>
                  </div>
                  {faculty.phone_no && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{faculty.phone_no}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{roleMapping[faculty.role] || "Unknown Role"}</p>
                    </div>
                  </div>
                  {department && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{department.name}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty Status</CardTitle>
                <CardDescription>Current employment status and role information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active Faculty
                  </Badge>
                  <Badge variant={getRoleBadgeVariant(faculty.role)}>
                    {roleMapping[faculty.role] || "Unknown Role"}
                  </Badge>
                  {department && <Badge variant="outline">{department.name} Department</Badge>}
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
