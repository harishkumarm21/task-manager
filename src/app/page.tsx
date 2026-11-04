import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">Task manager</h1>
      <p className="max-w-md text-gray-600">
        Create, track and finish your tasks. your data is private to your
        account
      </p>
      <div className="flex gap-4">
        {[
          { id: 1, title: "Get Started", href: "/signup" },
          { id: 2, title: "Log in", href: "/login" },
        ].map((item) => (
          <Link
            key={item.id}
            className="border px-5 py-2 text-white bg-black rounded-md "
            href={item.href}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
