"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Building, Hash, Calendar, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"

export default function AddCourse() {
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

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
    const courseData = {
      name: formData.get("name"),
      credits: Number.parseInt(formData.get("credits"), 10),
      semester: Number.parseInt(formData.get("semester"), 10),
      department_id: Number.parseInt(formData.get("departmentId"), 10),
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Course added successfully!")
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
            <h1 className="text-lg font-semibold">Add Course</h1>
            <p className="text-sm text-muted-foreground">Create a new course</p>
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
                Course Information
              </CardTitle>
              <CardDescription>Enter the details for the new course</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Course Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Course Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter course name"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Credits */}
                  <div className="space-y-2">
                    <Label htmlFor="credits" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Credits <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="credits"
                      name="credits"
                      type="number"
                      placeholder="Enter credits"
                      min="1"
                      max="10"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Semester <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="semester"
                      name="semester"
                      type="number"
                      placeholder="Enter semester"
                      min="1"
                      max="8"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="departmentId" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select name="departmentId" required>
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
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding Course...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Add Course
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
