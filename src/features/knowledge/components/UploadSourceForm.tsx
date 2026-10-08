"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useUploadSourceForm } from "@/features/knowledge/components/useUploadSourceForm";

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.txt,.md,.markdown,.csv,.xlsx,.xls";

export function UploadSourceForm({ upload }: { upload: (name: string, files: File[]) => Promise<void> }) {
  const { name, setName, files, handleFilesChange, isSubmitting, error, handleSubmit } = useUploadSourceForm(upload);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field
        label="Nom de la source"
        name="name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="upload-files" className="text-sm font-medium text-foreground">
          Fichiers
        </label>
        <input
          id="upload-files"
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={(event) => handleFilesChange(event.target.files)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
        {files.length > 0 && (
          <p className="text-xs text-muted">{files.map((file) => file.name).join(", ")}</p>
        )}
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Importer
        </Button>
      </div>
    </form>
  );
}
