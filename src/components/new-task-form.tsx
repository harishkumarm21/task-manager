"use client";

import createTask from "@/app/dashboard/actions";
import { useActionState, useEffect, useRef } from "react";

export function NewTaskForm() {
  const [state, formAction, pending] = useActionState(createTask, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="mt-6 space-y-2">
      <div className="flex gap-8">
        <input
          type="text"
          name="title"
          maxLength={200}
          placeholder="New task...."
          className="flex rounded-md border px-3 py-2"
        />

        <select
          name="priority"
          defaultValue={"medium"}
          className="rounded-md border px-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          className="rounded-md bg-black px-4 text-white disabled:opacity-50"
          disabled={pending}
        >
          {pending ? "Adding..." : "Add"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
