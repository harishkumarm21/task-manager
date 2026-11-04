"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TaskState = { error?: string; ok?: boolean } | null;

const PRIORITIES = ["low", "medium", "high"];

export default async function createTask(
  _prev: TaskState,
  formData: FormData,
): Promise<TaskState> {
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");

  if (!title) return { error: "Title is required" };
  if (title.length > 200) return { error: "Title max 200 characters" };
  if (!PRIORITIES.includes(priority)) return { error: "Invalid priority" };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({ title, priority });
  console.log("➕ CREATE", title, error ? `❌ ${error.message}` : "✅");

  if (error) return { error: "Could not create task" };

  revalidatePath("/dashboard");
  return { ok: true };
}

const STATUES = ["todo", "in_progress", "done"];

export async function updateTaskStatus(
  id: string,
  status: string,
): Promise<TaskState> {
  if (!STATUES.includes(status)) return { error: "Invalid Status" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select("id");

  console.log(
    "✏️ STATUS",
    id,
    status,
    error ? `❌ ${error.message}` : `✅ rows: ${data.length}`,
  );

  if (error || data.length === 0) return { error: "could not update task" };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTask(id: string): Promise<TaskState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select("id");

  console.log(
    "🗑️ DELETE",
    id,
    error ? `❌ ${error.message}` : `✅ rows: ${data.length}`,
  );

  if (error || data.length === 0) return { error: "Could not delete task" };

  revalidatePath("/dashboard");
  return { ok: true };
}
