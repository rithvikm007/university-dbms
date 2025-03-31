"use client";

import AdminNavbar from "@/app/components/AdminNavbar";


export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AdminNavbar />
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}

