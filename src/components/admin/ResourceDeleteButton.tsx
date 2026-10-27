"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteResource } from "@/lib/actions/resources";

export default function ResourceDeleteButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-ghost"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete "${title}"? This removes its files too.`)) {
          return;
        }
        startTransition(async () => {
          await deleteResource(id);
          router.refresh();
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
