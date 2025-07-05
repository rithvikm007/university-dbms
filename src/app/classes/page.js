"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, GraduationCap, Users, Plus, BookOpen, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import Loading from "@/app/components/loading"
import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function ClassesPage() {
  useRestrictToUserType(["admin"])
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes")
        const data = await response.json()

        if (response.ok) {
          setClasses(data.classes || [])
          setFilteredClasses(data.classes || [])
        } else {
          setError(data.error || "Failed to load classes.")
        }
      } catch (err) {
        setError("Something went wrong while fetching classes.")
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  useEffect(() => {
    const filtered = classes.filter(
      (cls) =>
        cls.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.faculty_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClasses(filtered)
  }, [searchTerm, classes])

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
              <BreadcrumbItem>
                <BreadcrumbPage>Classes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
              <p className="text-muted-foreground">Manage class assignments and course-faculty relationships</p>
            </div>
            <Button asChild>
              <Link href="/classes/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Link>
            </Button>
          </div>

          {/* Search and Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-3">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search classes by course or faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Classes Grid */}
          {error ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Classes Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "No classes match your search criteria." : "No classes have been created yet."}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link href="/classes/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Class
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          {cls.course_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Faculty: {cls.faculty_name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/classes/${cls.course_id}/${cls.faculty_id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
