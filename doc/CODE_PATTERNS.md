## Server Action mutation pattern
validate → insert → revalidatePath → return { ok | error }
- revalidatePath → refresh server data without client fetch
- user_id from DB default, never from the form
- useRef + reset() → clear form on success

## Calling a Server Action without a form
- useTransition → [pending, startTransition]
- startTransition(async () => await action(args))
- Form → useActionState | Button/select → useTransition

## RLS update gotcha
- Blocked update = no error, 0 rows
- .update().eq().select("id") → check data.length

## Delete pattern
confirm() → useTransition → action(id) → .delete().eq().select("id") → revalidatePath
- Same 0-rows check as update (RLS blocks silently)
- Destructive action → always confirm