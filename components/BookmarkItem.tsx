'use client'

import { useState } from 'react'
import { Bookmark } from '@/lib/types'
import { ExternalLink, Trash2, Calendar, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface BookmarkItemProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  index?: number // For staggered animation
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export default function BookmarkItem({ bookmark, onDelete, index = 0 }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setDeleting(true)
    await onDelete(bookmark.id)
    setDeleting(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Generate a favicon URL (using Google's service for simplicity)
  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    } catch {
      return ''
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative h-full"
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block h-full glass-card rounded-2xl p-5 border border-white/20 dark:border-white/5",
          "hover:border-brand-500/30 dark:hover:border-brand-400/30",
          "hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-900/20",
          "transition-all duration-300 flex flex-col"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-inner border border-white/50 dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
            {/* Fallback to Globe icon if image fails to load (img onError handler could be added) */}
            <img
              src={getFaviconUrl(bookmark.url)}
              alt=""
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Globe className="w-6 h-6 text-gray-400 hidden" />
          </div>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors z-10"
            title="Delete bookmark"
          >
            {deleting ? (
              <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </motion.button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 break-all">
            {bookmark.url}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100/50 dark:border-gray-800/50 mt-auto">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{formatDate(bookmark.created_at)}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-500/0 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-all transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
            <span>Visit</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </a>
    </motion.div>
  )
}
