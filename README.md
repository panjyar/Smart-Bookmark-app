# 📚 Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase. Users can authenticate with Google, store personal bookmarks, and see updates instantly across all open tabs.

## ✨ Features

- 🔐 Google OAuth Authentication
- 📝 Create, Read, Delete bookmarks
- ⚡ Real-time synchronization across tabs
- 🔒 Secure Row Level Security (RLS)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🌙 Dark mode support

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase Postgres
- **Real-time**: Supabase Realtime Subscriptions
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🏗 System Architecture

```
Client (Next.js UI)
  ↓
Supabase Auth (Google OAuth)
  ↓
Supabase Postgres (Bookmarks table with RLS)
  ↓
Supabase Realtime (WebSocket subscriptions)
```

## 📊 Database Schema

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  url text not null,
  title text not null,
  created_at timestamp default now()
);
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Console account (for OAuth)

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

### 4. Enable Google Auth in Supabase

1. In your Supabase project, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste your Google OAuth credentials
4. Save the configuration

### 5. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL from `supabase-schema.sql`:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  url text not null,
  title text not null,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Policies
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table bookmarks;
```

### 6. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-bookmark-app

# Install dependencies
npm install
```

### 7. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   Find these values in: **Supabase Dashboard** → **Settings** → **API**

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 9. Test the App

1. Click "Sign in with Google"
2. Authorize the application
3. Add some bookmarks
4. Open the app in another tab to see real-time sync
5. Delete a bookmark and watch it disappear in both tabs

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### Update Google OAuth Redirect

After deployment, add your Vercel URL to Google OAuth:
```
https://your-app.vercel.app
```

And update Supabase redirect URL in Authentication settings.

## 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own bookmarks
- **No Service Role Key**: Only the anon public key is used
- **Secure Authentication**: Google OAuth handled by Supabase
- **Environment Variables**: Sensitive data stored in `.env.local`

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home/Login page
├── components/
│   ├── BookmarkForm.tsx       # Add bookmark form
│   ├── BookmarkItem.tsx       # Single bookmark display
│   ├── BookmarkList.tsx       # List of bookmarks
│   ├── LoginButton.tsx        # Google login button
│   └── LogoutButton.tsx       # Logout button
├── lib/
│   ├── supabaseClient.ts      # Supabase client setup
│   └── types.ts               # TypeScript types
├── .env.local.example         # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── supabase-schema.sql        # Database schema
├── tailwind.config.js
└── tsconfig.json
```

## 🧪 Testing Checklist

- [x] Google login works
- [x] Logout works
- [x] User cannot see others' bookmarks (RLS)
- [x] Add bookmark successfully
- [x] Delete bookmark successfully
- [x] Real-time sync across tabs
- [x] URL validation
- [x] Responsive design
- [x] Dark mode support

## 🐛 Common Issues & Solutions

### Issue: OAuth redirect mismatch
**Solution**: Ensure redirect URLs match in both Google Console and Supabase settings

### Issue: RLS blocking queries
**Solution**: Verify policies use `auth.uid() = user_id` correctly

### Issue: Realtime not working
**Solution**: Check if realtime is enabled for the table:
```sql
alter publication supabase_realtime add table bookmarks;
```

### Issue: Environment variables not loading
**Solution**: Ensure variables are prefixed with `NEXT_PUBLIC_` and restart dev server

### Issue: "Invalid API key" error
**Solution**: Double-check that you're using the **anon public key**, not the service role key

## 🎯 Problems Faced & How I Solved Them

### 1. Real-time Updates Not Working
**Problem**: Bookmarks weren't syncing across tabs initially.

**Solution**: Had to enable the table for realtime replication in Supabase:
```sql
alter publication supabase_realtime add table bookmarks;
```

### 2. RLS Policies Too Restrictive
**Problem**: Couldn't fetch bookmarks even though policies were set.

**Solution**: Realized the filter in realtime subscription needed to match the user_id. Updated the channel subscription to include proper filtering.

### 3. OAuth Redirect Issues
**Problem**: After Google login, users were redirected to wrong URL.

**Solution**: Added explicit `redirectTo` option in the OAuth call to ensure users land on the dashboard.

## 📚 Learnings

- **Supabase RLS**: Powerful security model that works at the database level
- **Next.js App Router**: Server and client components have different capabilities
- **Real-time subscriptions**: Need to properly clean up subscriptions to avoid memory leaks
- **OAuth Flow**: Understanding the complete authentication flow with redirects
- **TypeScript**: Strong typing helps catch errors early in development

## 🔮 Future Enhancements

- [ ] Tags/categories for bookmarks
- [ ] Search functionality
- [ ] Bookmark folders
- [ ] Import/export bookmarks
- [ ] Favicon fetching
- [ ] Drag-and-drop reordering
- [ ] Share bookmarks with others
- [ ] Browser extension

## 📄 License

MIT License - feel free to use this project for learning or your own applications!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or run into issues, feel free to open an issue on GitHub!

---

**Live Demo**: [Add your Vercel URL here]

**GitHub Repository**: [Add your GitHub repo URL here]

Made with ❤️ using Next.js and Supabase
