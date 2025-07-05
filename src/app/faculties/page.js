"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Eye, Plus, Search, Building, ArrowLeft, UserCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function FacultyList() {
  useRestrictToUserType(["admin"])
  const [faculty, setFaculty] = useState([])
  const [filteredFaculty, setFilteredFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
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
        const response = await fetch("/api/faculties")
        const data = await response.json()

        if (response.ok) {
          setFaculty(data.faculty)
          setFilteredFaculty(data.faculty)
        } else {
          setError("Failed to fetch faculty members.")
        }
      } catch (error) {
        setError("Something went wrong.")
        console.error("Error fetching faculty:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  useEffect(() => {
    const filtered = faculty.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roleMapping[member.role].toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredFaculty(filtered)
  }, [searchTerm, faculty])

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
            <h1 className="text-lg font-semibold">Faculty</h1>
            <p className="text-sm text-muted-foreground">Manage faculty members</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <div>
              <h2 className="text-2xl font-bold">Faculty Directory</h2>
              <p className="text-muted-foreground">
                {filteredFaculty.length} faculty member{filteredFaculty.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/faculties/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Faculty
            </CardTitle>
            <CardDescription>Search by name, role, or department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search faculty members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              All Faculty Members
            </CardTitle>
            <CardDescription>Complete list of faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredFaculty.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No faculty members found matching your search." : "No faculty members found."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => router.push("/faculties/new")} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Faculty Member
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaculty.map((member) => (
                  <Card key={member.faculty_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <UserCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{member.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {member.department_name}
                                </span>
                                <span>ID: {member.faculty_id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {roleMapping[member.role] || "Unknown Role"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/faculties/${member.faculty_id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
