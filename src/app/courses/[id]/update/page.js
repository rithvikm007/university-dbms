"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { BookOpen, Building2, Save, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function UpdateCourse() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [name, setName] = useState("")
  const [credits, setCredits] = useState("")
  const [semester, setSemester] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`)
        const data = await response.json()

        if (response.ok) {
          setName(data.course.name)
          setCredits(data.course.credits.toString())
          setSemester(data.course.semester.toString())
          setDepartmentId(data.course.department_id.toString())
        } else {
          setError("Course not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching course:", error)
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

    Promise.all([fetchCourse(), fetchDepartments()]).finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          credits: Number.parseInt(credits),
          semester: Number.parseInt(semester),
          department_id: Number.parseInt(departmentId),
        }),
      })

      if (response.ok) {
        setSuccess("Course updated successfully!")
        setTimeout(() => router.push(`/courses/${id}`), 1000)
      } else {
        setError("Failed to update course.")
      }
    } catch (error) {
      setError("Something went wrong.")
      console.error("Error updating course:", error)
    } finally {
      setSubmitting(false)
    }
  }

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
                  <BreadcrumbLink href={`/courses/${id}`}>Course Details</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update</BreadcrumbPage>
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
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Update Course</h1>
                    <p className="text-muted-foreground">Modify course information</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => router.back()} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              {/* Update Form */}
              <div className="max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>Update the course details below</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Course Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">Course Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter course name"
                            required
                          />
                        </div>

                        {/* Credits */}
                        <div className="space-y-2">
                          <Label htmlFor="credits">Credits</Label>
                          <Input
                            id="credits"
                            type="number"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            placeholder="Enter credits"
                            min="1"
                            max="10"
                            required
                          />
                        </div>

                        {/* Semester */}
                        <div className="space-y-2">
                          <Label htmlFor="semester">Semester</Label>
                          <Input
                            id="semester"
                            type="number"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            placeholder="Enter semester"
                            min="1"
                            max="8"
                            required
                          />
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select value={departmentId} onValueChange={setDepartmentId} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {dept.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-destructive text-sm font-medium">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-green-700 text-sm font-medium">{success}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex gap-3">
                        <Button type="submit" disabled={submitting} className="gap-2">
                          <Save className="h-4 w-4" />
                          {submitting ? "Updating..." : "Update Course"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
