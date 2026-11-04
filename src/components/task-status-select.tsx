"use client";
import { updateTaskStatus } from "@/app/dashboard/actions";
import { useState, useTransition } from "react";

type Props = {
  id: string;
  status: string;
};

export function TaskStatusSelect({ id, status }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setError(null);
    startTransition(async () => {
      const result = await updateTaskStatus(id, next);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={handleChange}
        className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
