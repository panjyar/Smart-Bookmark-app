'use client'

import { Bookmark } from '@/lib/types'
import BookmarkItem from './BookmarkItem'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">No bookmarks yet</p>
        <p className="text-sm">Add your first bookmark above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
