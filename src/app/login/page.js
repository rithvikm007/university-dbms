"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, AlertCircle } from "lucide-react"

export default function Login() {
  const [error, setError] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        localStorage.removeItem("token")
        return
      }

      if (decodedToken.userType === "admin") {
        router.push("/dashboard/admin")
      } else if (decodedToken.userType === "faculty") {
        router.push("/dashboard/faculty")
      } else if (decodedToken.userType === "student") {
        router.push("/dashboard/student")
      }
    } catch (error) {
      console.error("Invalid token:", error)
      localStorage.removeItem("token")
    }
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)

        const userDetailsResponse = await fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })

        const userDetails = await userDetailsResponse.json()
        if (userDetails.user_type === "admin") {
          router.push("/dashboard/admin")
        } else if (userDetails.user_type === "faculty") {
          router.push("/dashboard/faculty")
        } else if (userDetails.user_type === "student") {
          router.push("/dashboard/student")
        } else {
          setError("You do not have permission to access this page.")
          localStorage.removeItem("token")
        }
      } else {
        setError(data.error || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">University Management</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Need help? Contact your system administrator</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 University Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
