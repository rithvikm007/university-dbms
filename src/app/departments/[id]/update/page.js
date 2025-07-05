"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Building2, Save, ArrowLeft, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Loading from "@/app/components/loading"
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
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function UpdateDepartment() {
  useRestrictToUserType(["admin"])
  const { id } = useParams()
  const [name, setName] = useState("")
  const [hod, setHod] = useState("0") 
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`/api/departments/${id}`)
        const data = await response.json()

        if (response.ok) {
          setName(data.department.name)
          setHod(data.hod ? data.hod.user_id.toString() : "0") // Updated default value to be a non-empty string
        } else {
          setError("Department not found.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching department:", error)
      }
    }

    const fetchFaculties = async () => {
      try {
        const response = await fetch(`/api/departments/${id}/faculties`)
        const data = await response.json()
        if (response.ok) {
          setFaculties(data.faculties)
        }
      } catch (error) {
        console.error("Error fetching faculties:", error)
      }
    }

    Promise.all([fetchDepartment(), fetchFaculties()]).finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, hod_id: hod || null }),
      })

      if (response.ok) {
        setSuccess("Department updated successfully!")
        setTimeout(() => router.push(`/departments/${id}`), 1500)
      } else {
        setError("Failed to update department.")
      }
    } catch (error) {
      setError("Something went wrong.")
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/departments">Departments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/departments/${id}`}>Details</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Update</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="max-w-2xl mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Update Department</h1>
              <p className="text-muted-foreground">Update department information and assign head of department</p>
            </div>

            {error && (
              <Alert className="mb-6 border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500/50 text-green-700 bg-green-50">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Department Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter department name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hod">Head of Department</Label>
                    <Select value={hod} onValueChange={setHod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HOD (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No HOD Assigned</SelectItem>{" "}
                        {/* Updated value to be a non-empty string */}
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.faculty_id} value={faculty.faculty_id.toString()}>
                            {faculty.User.name} ({faculty.User.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The Head of Department (HOD) is responsible for overseeing the academic and administrative
                      activities of the department. This field is optional and can be updated later.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Department
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
