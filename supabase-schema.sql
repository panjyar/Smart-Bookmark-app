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

-- Policy: Users can view only their own bookmarks
create policy "Users can view own bookmarks"
  on bookmarks
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on bookmarks
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on bookmarks
  for delete
  using (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
create policy "Users can update own bookmarks"
  on bookmarks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable realtime for the bookmarks table
alter publication supabase_realtime add table bookmarks;

-- Grant realtime access (ensures realtime can read changes)
grant all on bookmarks to postgres, anon, authenticated, service_role;
