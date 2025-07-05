"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function UpdateStudent() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [admissionYear, setAdmissionYear] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`)
        const data = await response.json()

        if (response.ok) {
          setName(data.student.name)
          setEmail(data.student.email)
          setPhone(data.student.phone_no || "")
          setAdmissionYear(data.student.admission_year || "")
          setGraduationYear(data.student.graduation_year || "")
          setDepartmentId(data.student.department_id?.toString() || "")
        } else {
          setError("Student not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching student:", error)
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

    Promise.all([fetchStudent(), fetchDepartments()]).finally(() => {
      setLoading(false)
    })
  }, [id])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          department_id: departmentId,
          admission_year: admissionYear,
          graduation_year: graduationYear || null,
        }),
      })

      if (response.ok) {
        setSuccess("Student details updated successfully!")
        setTimeout(() => router.push(`/students/${id}`), 2000)
      } else {
        setError("Failed to update student details.")
      }
    } catch (error) {
      setError("Something went wrong.")
      console.error("Error updating student:", error)
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
            <h1 className="text-lg font-semibold">Update Student</h1>
            <p className="text-sm text-muted-foreground">Edit student information</p>
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
                <CardDescription>Update basic student details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="student-form" onSubmit={handleUpdate} className="space-y-4">
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
                      placeholder="Enter student's full name"
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
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
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
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>Update department and academic year details</CardDescription>
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

                {/* Admission Year */}
                <div className="space-y-2">
                  <Label htmlFor="admissionYear" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Admission Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admissionYear"
                    type="number"
                    value={admissionYear}
                    onChange={(e) => setAdmissionYear(e.target.value)}
                    placeholder="Enter admission year"
                    min="2000"
                    max="2030"
                    required
                    className="w-full"
                  />
                </div>

                {/* Graduation Year */}
                <div className="space-y-2">
                  <Label htmlFor="graduationYear" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Graduation Year
                  </Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="Enter expected graduation year"
                    min="2024"
                    max="2035"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if not determined yet</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button type="submit" form="student-form" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating Student...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Student
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
