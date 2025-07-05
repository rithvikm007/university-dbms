"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Building, BookOpen, Calendar, GraduationCap, TrendingUp, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Loading from "@/app/components/loading"

const quickActions = [
  {
    title: "Add Student",
    description: "Register a new student",
    icon: UserPlus,
    href: "/students/new",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Add Faculty",
    description: "Add faculty member",
    icon: Users,
    href: "/faculties/new",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Add Department",
    description: "Create new department",
    icon: Building,
    href: "/departments/new",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Add Course",
    description: "Create new course",
    icon: BookOpen,
    href: "/courses/new",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Assign Course",
    description: "Assign course to faculty",
    icon: Calendar,
    href: "/classes/new",
    color: "bg-teal-500 hover:bg-teal-600",
  },
  {
    title: "Add Admin",
    description: "Create admin account",
    icon: UserPlus,
    href: "/signup",
    color: "bg-red-500 hover:bg-red-600",
  },
]


import useRestrictToUserType from "@/hooks/useRestrictToUserType"

export default function AdminDashboard() {
  useRestrictToUserType(["admin"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [facultyCount, setFacultyCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [courseCount, setCourseCount] = useState(0)
  const [departmentCount, setDepartmentCount] = useState(0)
  const stats = [
  {
    title: "Total Students",
    value: studentCount,
    icon: GraduationCap,
    color: "text-blue-600",
  },
  {
    title: "Faculty Members",
    value: facultyCount,
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Active Courses",
    value: courseCount,
    icon: BookOpen,
    color: "text-purple-600",
  },
  {
    title: "Departments",
    value: departmentCount,
    icon: Building,
    color: "text-orange-600",
  },
]

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (response.ok && data.user_type === "admin") {
          setLoading(false)
        } else {
          setError("You do not have permission to access this page.")
          router.push("/login")
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        setError("Something went wrong. Please try again.")
      }
    }
    const fetchCounts = async () => {
  try {
    const [facultyRes, studentRes, courseRes, departmentRes] = await Promise.all([
      fetch("/api/faculties"),
      fetch("/api/students"),
      fetch("/api/courses"),
      fetch("/api/departments"),
    ])

    const facultyData = await facultyRes.json()
    const studentData = await studentRes.json()
    const courseData = await courseRes.json()
    const departmentData = await departmentRes.json()

    if (facultyRes.ok) setFacultyCount(facultyData.faculty.length)
    if (studentRes.ok) setStudentCount(studentData.students.length)
    if (courseRes.ok) setCourseCount(courseData.courses.length)
    if (departmentRes.ok) setDepartmentCount(departmentData.departments.length)
  } catch (error) {
    setError("Failed to fetch statistics.")
    console.error("Error fetching data:", error)
  } finally {
    setLoading(false)
  }
}

    fetchCounts();

    fetchUserDetails()
  }, [router])


  if (loading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your university system</p>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <Card key={action.title} className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-4">
                    <Button
                      onClick={() => router.push(action.href)}
                      className={`w-full h-auto p-4 flex-col gap-3 ${action.color} text-white group-hover:scale-105 transition-transform`}
                    >
                      <action.icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">{action.title}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </SidebarInset>
  )
}
