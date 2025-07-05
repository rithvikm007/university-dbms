"use client"

import { useRouter } from "next/navigation"
import { GraduationCap, Users, BookOpen, Calendar, Award, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student enrollment and profile management system",
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Organize courses, departments, and academic programs efficiently",
    },
    {
      icon: Calendar,
      title: "Attendance Tracking",
      description: "Real-time attendance monitoring and reporting for all classes",
    },
    {
      icon: Award,
      title: "Grade Management",
      description: "Complete examination and grading system with detailed analytics",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control for administrators, faculty, and students",
    },
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Tools and features designed to enhance educational outcomes",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-600 rounded-full">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              University Management
              <span className="block text-blue-600">System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for managing academic operations, student records, faculty assignments, and
              institutional workflows with modern efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Access Portal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Education</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools empowers educational institutions to streamline operations and enhance
            academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-gray-400">© 2025 University Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
