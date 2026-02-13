'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoginButton from '@/components/LoginButton'
import { Zap, Shield, RefreshCw } from 'lucide-react'

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
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative z-10 animate-slide-up">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl shadow-lg shadow-brand-500/20 mb-2">
            <Zap className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200">
              Smart Bookmark
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your digital memory, synchronized.
            </p>
          </div>

          <div className="py-6">
            <LoginButton />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
            <div className="flex flex-col items-center gap-1">
              <Shield size={16} className="text-brand-500" />
              <span>Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw size={16} className="text-indigo-500" />
              <span>Real-time</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap size={16} className="text-orange-500" />
              <span>Fast</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
