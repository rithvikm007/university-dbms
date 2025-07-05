"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Building,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CalendarDays,
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

export default function AddStudent() {
  useRestrictToUserType(["admin"])
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [admissionYear, setAdmissionYear] = useState("")
  const router = useRouter()

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    setAdmissionYear(currentYear.toString())
  }, [])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/departments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()

        if (response.ok) {
          setDepartments(data.departments)
        } else {
          setError("Failed to load departments.")
        }
      } catch (error) {
        setError("Something went wrong while fetching departments.")
        console.error("Error fetching departments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    const formData = new FormData(event.target)
    const studentData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone_no: formData.get("phone_no"),
      password: formData.get("password"),
      dob: formData.get("dob"),
      admission_year: formData.get("admission_year"),
      graduation_year: formData.get("graduation_year") || null,
      departmentId: formData.get("departmentId"),
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Student added successfully!")
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
            <h1 className="text-lg font-semibold">Add Student</h1>
            <p className="text-sm text-muted-foreground">Register a new student account</p>
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
                <CardDescription>Basic student details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
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
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone_no" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone_no"
                      name="phone_no"
                      type="tel"
                      placeholder="Enter phone number"
                      pattern="[0-9]{10}"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input id="dob" name="dob" type="date" required className="w-full" />
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
                <CardDescription>Department and academic year details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="departmentId" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select name="departmentId" required form="student-form">
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
                  <Label htmlFor="admission_year" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Admission Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admission_year"
                    name="admission_year"
                    type="number"
                    placeholder="Enter admission year"
                    value={admissionYear}
                    onChange={(e) => setAdmissionYear(e.target.value)}
                    min="2000"
                    max="2030"
                    required
                    form="student-form"
                    className="w-full"
                  />
                </div>

                {/* Graduation Year */}
                <div className="space-y-2">
                  <Label htmlFor="graduation_year" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Graduation Year
                  </Label>
                  <Input
                    id="graduation_year"
                    name="graduation_year"
                    type="number"
                    placeholder="Enter expected graduation year"
                    min="2024"
                    max="2035"
                    form="student-form"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if not determined yet</p>
                </div>

                {/* Academic Status Info */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Academic Status</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• Student will be enrolled as a new student</p>
                    <p>• Default semester will be set to 1st semester</p>
                    <p>• Student can enroll in courses after account creation</p>
                  </div>
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
                      Adding Student...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Add Student
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
