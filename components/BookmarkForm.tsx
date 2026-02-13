'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Link as LinkIcon, Type } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookmarkFormProps {
  userId: string
  onSuccess?: () => void
}

export default function BookmarkForm({ userId, onSuccess }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!url.trim() || !title.trim()) {
      alert('Please fill in both fields')
      return
    }

    // Simple URL validation
    try {
      new URL(url)
    } catch {
      alert('Please enter a valid URL')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          url: url.trim(),
          title: title.trim(),
          user_id: userId
        }
      ])
      .select()

    setLoading(false)

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Failed to add bookmark: ' + error.message)
    } else {
      console.log('Bookmark added successfully:', data)
      // Clear form
      setUrl('')
      setTitle('')
      setIsExpanded(false)
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <motion.div
      layout
      className="glass-card rounded-2xl p-1 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
            Add New Bookmark
          </h2>
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400 hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-colors">
              <Plus size={20} />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.form
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto", marginTop: 24 },
                collapsed: { opacity: 0, height: 0, marginTop: 0 }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={handleSubmit}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
                    <LinkIcon size={18} />
                  </div>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
                    <Type size={18} />
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bookmark Title"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>Add Bookmark</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}