"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/components/admin-sidebar"

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-gray-50/50">{children}</main>
    </SidebarProvider>
  )
}
