'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface BookmarkFormProps {
  userId: string
  onSuccess?: () => void
}

export default function BookmarkForm({ userId, onSuccess }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

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

    console.log('Inserting bookmark:', { url, title, user_id: userId })

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
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Add New Bookmark
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Favorite Website"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}