'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoginButton from '@/components/LoginButton'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Smart Bookmark
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage your bookmarks in real-time
          </p>
          <LoginButton />
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Features:</p>
            <ul className="space-y-1">
              <li>✅ Google Authentication</li>
              <li>✅ Real-time Sync</li>
              <li>✅ Secure & Private</li>
              <li>✅ Fast & Reliable</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
