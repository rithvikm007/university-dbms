"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";

const AdminNavbar = () => {
    const router = useRouter();
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserType(decoded.userType);
                } catch (error) {
                    console.error("Invalid token");
                    localStorage.removeItem("token");
                    setUserType(null);
                }
            } else {
                setUserType(null);
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUserType(null);
        router.push("/login");
    };

    const navLinks = {
        admin: [
            {
                name: "Students",
                subLinks: [
                    { name: "View All", path: "/students" },
                    { name: "Add Student", path: "/students/new" },
                ],
            },
            {
                name: "Faculties",
                subLinks: [
                    { name: "View All", path: "/faculties" },
                    { name: "Add Faculty", path: "/faculties/new" },
                ],
            },
            {
                name: "Courses",
                subLinks: [
                    { name: "View All", path: "/courses" },
                    { name: "Add Course", path: "/courses/new" },
                ],
            },
            {
                name: "Departments",
                subLinks: [
                    { name: "View All", path: "/departments" },
                    { name: "Add Department", path: "/departments/new" },
                ],
            },
        ],
    };

    return (
        userType === "admin" ? (
            <nav className="bg-blue-600 text-white p-4 shadow-lg w-full sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-lg font-bold px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200">
                        University Portal
                    </Link>
    
                    <ul className="flex space-x-4">
                        <li key="dashboard" className="mt-2">
                            <Link href={`/dashboard/${userType}`} className="px-4 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-200">
                                Dashboard
                            </Link>
                        </li>
                        {navLinks[userType]?.map((link) =>
                            link.subLinks ? (
                                <li key={link.name} className="relative group">
                                    <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200">
                                        {link.name} ▼
                                    </button>
                                    <ul className="absolute left-0 w-40 bg-white text-black shadow-lg rounded-md hidden group-hover:block">
                                        {link.subLinks.map((subLink) => (
                                            <li key={subLink.path}>
                                                <Link
                                                    href={subLink.path}
                                                    className="block px-4 py-2 bg-white text-blue-600 hover:bg-gray-200 rounded-md"
                                                >
                                                    {subLink.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ) : (
                                <li key={link.path}>
                                    <Link href={link.path} className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200">
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
    
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        <FaSignOutAlt className="mr-2" /> Log Out
                    </button>
                </div>
            </nav>
        ) : null
    );
};    
export default AdminNavbar;
