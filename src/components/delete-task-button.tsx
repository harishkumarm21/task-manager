"use client";
import { deleteTask } from "@/app/dashboard/actions";
import { useState, useTransition } from "react";

export function DeleteTaskButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm("Delete this task?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteTask(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-red-200 py-1 px-2 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        {pending ? "Deleting" : "Delete"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
