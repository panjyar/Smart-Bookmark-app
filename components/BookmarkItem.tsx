'use client'

import { useState } from 'react'
import { Bookmark } from '@/lib/types'

interface BookmarkItemProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150">
      <div className="flex-1 min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {bookmark.url}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {formatDate(bookmark.created_at)}
          </p>
        </a>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition duration-200 flex-shrink-0"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
