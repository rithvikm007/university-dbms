"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Users, User, Mail, Phone, Building, UserCheck, ArrowLeft, CheckCircle, AlertCircle, Save } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function UpdateFaculty() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [role, setRole] = useState("")
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const roles = ["Professor", "Associate Professor", "Assistant Professor"]
  const roleMapping = {
    Professor: "professor",
    "Associate Professor": "associate_professor",
    "Assistant Professor": "assistant_professor",
  }

  const reverseRoleMapping = {
    professor: "Professor",
    associate_professor: "Associate Professor",
    assistant_professor: "Assistant Professor",
  }

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/faculties/${id}`)
        const data = await response.json()

        if (response.ok) {
          setName(data.faculty.name)
          setEmail(data.faculty.email)
          setPhone(data.faculty.phone_no || "")
          setDepartmentId(data.faculty.department_id?.toString() || "")
          setRole(data.faculty.role)
        } else {
          setError("Faculty member not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching faculty:", error)
      }
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments")
        const data = await response.json()
        if (response.ok) {
          setDepartments(data.departments)
        } else {
          setError("Failed to load departments.")
        }
      } catch (error) {
        setError("Something went wrong while fetching departments.")
        console.error("Error fetching departments:", error)
      }
    }

    Promise.all([fetchFaculty(), fetchDepartments()]).finally(() => {
      setLoading(false)
    })
  }, [id])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/faculties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          department_id: departmentId,
          role,
        }),
      })

      if (response.ok) {
        setSuccess("Faculty details updated successfully!")
        setTimeout(() => router.push(`/faculties/${id}`), 2000)
      } else {
        setError("Failed to update faculty details.")
      }
    } catch (error) {
      setError("Something went wrong.")
      console.error("Error updating faculty:", error)
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
            <h1 className="text-lg font-semibold">Update Faculty</h1>
            <p className="text-sm text-muted-foreground">Edit faculty member information</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="max-w-4xl mx-auto">
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

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update basic faculty details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="faculty-form" onSubmit={handleUpdate} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter faculty member's full name"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      required
                      className="w-full"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>Update department and role details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="departmentId" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select value={departmentId} onValueChange={setDepartmentId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleMapping).map(([display, value]) => (
                        <SelectItem key={value} value={value}>
                          {display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role Information */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Role Information</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Professor: Senior faculty with full academic privileges</p>
                    <p>• Associate Professor: Mid-level faculty position</p>
                    <p>• Assistant Professor: Entry-level faculty position</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button type="submit" form="faculty-form" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating Faculty...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Faculty
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
