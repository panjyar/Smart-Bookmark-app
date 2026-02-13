'use client'

import { Bookmark } from '@/lib/types'
import BookmarkItem from './BookmarkItem'
import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 px-4"
      >
        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <LayoutGrid className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Add your first bookmark to get started. Your collection will appear here instantly.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {bookmarks.map((bookmark, index) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </motion.div>
  )
}
