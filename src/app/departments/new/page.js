"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, User, Mail, Phone, Lock, UserPlus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function AddDepartment() {
  useRestrictToUserType(["admin"])
  const [name, setName] = useState("")
  const [assignHod, setAssignHod] = useState(false)
  const [hodDetails, setHodDetails] = useState({
    name: "",
    email: "",
    phone_no: "",
    password: "",
    role: "professor",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const roles = ["Professor", "Associate Professor", "Assistant Professor"]
  const roleMapping = {
    Professor: "professor",
    "Associate Professor": "associate_professor",
    "Assistant Professor": "assistant_professor",
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    const departmentData = {
      name,
      hod: assignHod
        ? {
            name: hodDetails.name,
            email: hodDetails.email,
            phone_no: hodDetails.phone_no,
            password: hodDetails.password,
            role: hodDetails.role,
          }
        : null,
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Department added successfully!")
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
            <h1 className="text-lg font-semibold">Add Department</h1>
            <p className="text-sm text-muted-foreground">Create a new department</p>
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
                <Building className="h-5 w-5" />
                Department Information
              </CardTitle>
              <CardDescription>Enter the details for the new department</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Department Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter department name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {/* Assign HOD Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Assign Head of Department
                      </Label>
                      <p className="text-sm text-muted-foreground">Would you like to assign a HOD now?</p>
                    </div>
                    <Switch checked={assignHod} onCheckedChange={setAssignHod} />
                  </div>
                </div>

                {/* HOD Details */}
                {assignHod && (
                  <Card className="border-muted">
                    <CardHeader>
                      <CardTitle className="text-base">Head of Department Details</CardTitle>
                      <CardDescription>Enter the information for the department head</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* HOD Name */}
                        <div className="space-y-2">
                          <Label htmlFor="hod-name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="hod-name"
                            type="text"
                            placeholder="Enter full name"
                            value={hodDetails.name}
                            onChange={(e) => setHodDetails({ ...hodDetails, name: e.target.value })}
                            required={assignHod}
                          />
                        </div>

                        {/* HOD Email */}
                        <div className="space-y-2">
                          <Label htmlFor="hod-email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="hod-email"
                            type="email"
                            placeholder="Enter email address"
                            value={hodDetails.email}
                            onChange={(e) => setHodDetails({ ...hodDetails, email: e.target.value })}
                            required={assignHod}
                          />
                        </div>

                        {/* HOD Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="hod-phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="hod-phone"
                            type="tel"
                            placeholder="Enter phone number"
                            pattern="[0-9]{10}"
                            value={hodDetails.phone_no}
                            onChange={(e) => setHodDetails({ ...hodDetails, phone_no: e.target.value })}
                            required={assignHod}
                          />
                        </div>

                        {/* HOD Password */}
                        <div className="space-y-2">
                          <Label htmlFor="hod-password" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="hod-password"
                            type="password"
                            placeholder="Enter password"
                            value={hodDetails.password}
                            onChange={(e) => setHodDetails({ ...hodDetails, password: e.target.value })}
                            required={assignHod}
                          />
                        </div>

                        {/* Department (Read-only) */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Department
                          </Label>
                          <Input value={name || "Department name will appear here"} disabled className="bg-muted" />
                        </div>

                        {/* HOD Role */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Role <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={hodDetails.role}
                            onValueChange={(value) => setHodDetails({ ...hodDetails, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
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
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding Department...
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4 mr-2" />
                        Add Department
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
