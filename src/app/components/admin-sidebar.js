"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import {
  GraduationCap,
  Users,
  UserPlus,
  Building,
  BookOpen,
  Calendar,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard/admin",
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      { title: "Add Student", url: "/students/new", icon: UserPlus },
      { title: "View All Students", url: "/students", icon: Users },
      { title: "Add Faculty", url: "/faculties/new", icon: UserPlus },
      { title: "View All Faculties", url: "/faculties", icon: Users },
      { title: "Add Admin", url: "/signup", icon: UserPlus },
    ],
  },
  {
    title: "Academic",
    icon: GraduationCap,
    items: [
      { title: "Add Department", url: "/departments/new", icon: Building },
      { title: "View All Departments", url: "/departments", icon: Building },
      { title: "Add Course", url: "/courses/new", icon: BookOpen },
      { title: "View All Courses", url: "/courses", icon: BookOpen },
      { title: "Assign Course", url: "/classes/new", icon: Calendar },
      { title: "View All Classes", url: "/classes", icon: Calendar },
    ],
  },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const decoded = jwtDecode(token)
      if (decoded.userType === "admin" || decoded.user_type === "admin") {
        setIsAdmin(true)
        // Fetch user details
        fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser({
              name: data.name || "Admin",
              email: data.email || "admin@university.edu",
            })
          })
          .catch((err) => {
            console.error("Error fetching user details:", err)
          })
      } else {
        setIsAdmin(false)
      }
    } catch (err) {
      console.error("Invalid token:", err)
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!isAdmin) return null

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">UMS Admin</h2>
            <p className="text-xs text-muted-foreground">University Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                              <a href={subItem.url} className="flex items-center gap-2">
                                <subItem.icon className="h-3 w-3" />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.name?.[0]?.toUpperCase() || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
