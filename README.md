#  Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase featuring Google OAuth authentication, real-time synchronization across tabs, and secure Row Level Security (RLS).

##  Tech Stack
Next.js 14, Supabase (Auth + Database + Realtime), Tailwind CSS, TypeScript

##  Problems Faced & Solutions

**Problem 1: Bookmarks Not Displaying in UI**
After adding bookmarks, they appeared in the Supabase database but not in the UI. The issue was that `fetchBookmarks()` wasn't being called after user authentication. I solved this by adding proper useEffect dependencies to trigger fetching when the user state updated, and added an `onSuccess` callback to the BookmarkForm component to manually refetch after insertions. I also added `.select()` after the insert query and comprehensive console logging to debug the data flow.

**Problem 2: Real-time Updates Not Working Across Tabs**
This was the most challenging issue. When adding a bookmark in one tab, it wouldn't appear in another tab without refresh. My debugging journey: First, I tried using `filter: user_id=eq.${user.id}` on the realtime subscription, but this blocked all events. Then I verified realtime was enabled with `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks` (got "already member" error, confirming it was enabled). I tried different channel names but still no events came through. After extensive console logging, I discovered the breakthrough: **Supabase Realtime filters can block events entirely**. The solution was to remove ALL filters from the subscription and handle filtering client-side with `if (payload.new.user_id === user.id)`. RLS policies already provide database-level security, making subscription filters redundant. I also split the subscription into separate INSERT, DELETE, and UPDATE handlers for better control and used optimistic UI updates (directly modifying state) instead of refetching. Testing with two browser tabs side-by-side with consoles open was crucial for verification.

**Key Learnings:** Trust RLS for security (don't duplicate with filters), simplify when debugging (remove complexity until it works), systematic testing (verify each layer independently), and comprehensive logging saves hours of confusion.

---

**Live Demo**: https://smart-bookmark-app-tan.vercel.app 
**Tech**: Next.js 14 | Supabase | Tailwind CSS | TypeScript