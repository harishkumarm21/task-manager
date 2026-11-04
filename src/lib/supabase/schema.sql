-- 1. Enum types
create type task_status as enum ('todo', 'in_progress', 'done');
create type task_priority as enum ('low', 'medium', 'high');

-- 2. Table
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  description text,
  status      task_status   not null default 'todo',
  priority    task_priority not null default 'medium',
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. Index (fast "my tasks" queries)
create index tasks_user_id_idx on public.tasks(user_id);

-- 4. Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- 5. Row Level Security
alter table public.tasks enable row level security;

create policy "select own tasks" on public.tasks
  for select to authenticated using (user_id = auth.uid());

create policy "insert own tasks" on public.tasks
  for insert to authenticated with check (user_id = auth.uid());

create policy "update own tasks" on public.tasks
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "delete own tasks" on public.tasks
  for delete to authenticated using (user_id = auth.uid());