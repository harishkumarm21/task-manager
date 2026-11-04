import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "../(auth)/actions";
import { NewTaskForm } from "@/components/new-task-form";
import { TaskStatusSelect } from "@/components/task-status-select";
import { DeleteTaskButton } from "@/components/delete-task-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("📊 DASHBOARD user:", user?.email);

  if (!user) redirect("/login");

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, title, status, priority, due_date")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold"> Dashboard</h1>
        <form action={signout}>
          <button className="rounded-md px-3 border py-1.5 text-sm">
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-4 text-gray-500">Logged in as {user.email}</p>

      <NewTaskForm />

      {error && (
        <p className="mt-6 rounded-md bg-red-50 text-red-600 p-3">
          Failed to Load Tasks
        </p>
      )}

      {!error && tasks.length === 0 && (
        <p className="mt-6 rounded-md border border-dashed p-6 text-center text-gray-500">
          No tasks yet
        </p>
      )}

      <ul className="mt-6 space-y-2">
        {tasks?.map((task) => (
          // <li
          //   key={task.id}
          //   className="flex justify-between items-center rounded-md border p-3"
          // >
          //   <span className="font-medium">{task.title}</span>
          //   <span className="text-sm text-gray-500">
          //     {task.status} - {task.priority}
          //   </span>
          // </li>
          <li
            key={task.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <p
                className={
                  task.status == "done"
                    ? "font-medium line-through text-gray-400"
                    : "font-medium"
                }
              >
                {task.title}
              </p>
              <p className="text-sm text-gray-600">{task.priority}</p>
            </div>
            <div className="flex items-center gap-4">
              <TaskStatusSelect id={task.id} status={task.status} />
              <DeleteTaskButton id={task.id} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
