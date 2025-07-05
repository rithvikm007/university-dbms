"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

export default function useRestrictToUserType(allowedTypes = []) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast("Unauthorized", {
        description: "Please log in to continue.",
      })
      router.push("/login")
      return
    }

    let decoded
    try {
      decoded = jwtDecode(token)
    } catch (err) {
      console.error("Invalid token:", err)
      localStorage.removeItem("token")
      toast("Invalid Token", {
        description: "Your session has expired. Please log in again.",
      })
      router.push("/login")
      return
    }

    const userType = decoded.user_type || decoded.userType

    if (!userType) {
      localStorage.removeItem("token")
      toast("Invalid Token", {
        description: "User role not found. Please log in again.",
      })
      router.push("/login")
      return
    }

    if (!allowedTypes.includes(userType)) {
      toast("Access Denied", {
        description: "You are not authorized to view this page.",
      })

      setTimeout(() => {
        router.push(`/dashboard/${userType}`)
      }, 2000)
    }
  }, [router, allowedTypes])
}
