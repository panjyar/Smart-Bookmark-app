'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { User, Bookmark } from '@/lib/types'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { LogOut, Zap, Radio, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [router])

  useEffect(() => {
    if (!user) return

    // Fetch bookmarks immediately
    fetchBookmarks()

    // Setup realtime subscription (Wildcard)
    const channelName = `bookmarks-${user.id}-${Date.now()}`
    setRealtimeStatus('connecting')

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          // HANDLE INSERT
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            if (newBookmark.user_id === user.id) {
              setBookmarks((current) => [newBookmark, ...current])
            }
          }
          // HANDLE DELETE
          else if (payload.eventType === 'DELETE') {
            const oldRecord = payload.old as { id: string }
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== oldRecord.id)
            )
          }
          // HANDLE UPDATE
          else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark
            if (updatedBookmark.user_id === user.id) {
              setBookmarks((current) =>
                current.map((bookmark) =>
                  bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
                )
              )
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected')
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setRealtimeStatus('error')
        else if (status === 'CLOSED') setRealtimeStatus('disconnected')
      })

    return () => {
      supabase.removeChannel(channel)
      setRealtimeStatus('disconnected')
    }
  }, [user])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Failed to delete bookmark: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredBookmarks = bookmarks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400 animate-pulse">Loading experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 mx-2 glass rounded-2xl px-6 py-4 flex justify-between items-center shadow-lg shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-brand-500/20">
                <Zap className="text-white h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 hidden sm:block">
                Smart Bookmark
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Realtime Status Pill */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${realtimeStatus === 'connected'
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                  : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                }`}>
                <div className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${realtimeStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${realtimeStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                </div>
                {realtimeStatus === 'connected' ? 'Live Sync' : 'Connecting...'}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8">

          {/* Sidebar / Form Area */}
          <div className="space-y-8">
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Organize your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">digital life.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Save links instantly. Access them anywhere. Real-time sync across all your devices.
                </p>
              </div>

              <BookmarkForm userId={user?.id || ''} />
            </div>
          </div>

          {/* Bookmarks Grid Area */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-brand-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Collection
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {bookmarks.length}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 dark:text-gray-300 text-sm"
                />
              </div>
            </div>

            <BookmarkList bookmarks={filteredBookmarks} onDelete={handleDelete} />
          </div>

        </div>
      </main>
    </div>
  )
}