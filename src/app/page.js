'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-black mb-4">Welcome to the University Portal</h1>
            <p className="text-lg text-gray-600 mb-6">Manage your courses, attendance, and results seamlessly.</p>
            <button 
                onClick={() => router.push('/login')} 
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
                Go to Login
            </button>
        </div>
    );
}
