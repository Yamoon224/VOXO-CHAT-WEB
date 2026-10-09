"use client";

import { useState, type FormEvent } from "react";
import { Button, Field } from "@/components/ui";

export function DateRangeForm({
  from,
  to,
  onApply,
}: {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}) {
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onApply(draftFrom, draftTo);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <Field label="Du" type="date" value={draftFrom} onChange={(event) => setDraftFrom(event.target.value)} />
      <Field label="Au" type="date" value={draftTo} onChange={(event) => setDraftTo(event.target.value)} />
      <Button type="submit" variant="secondary">
        Appliquer
      </Button>
    </form>
  );
}
