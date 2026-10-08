import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";

export function useUploadSourceForm(upload: (name: string, files: File[]) => Promise<void>) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function handleFilesChange(fileList: FileList | null) {
    setFiles(fileList ? Array.from(fileList) : []);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (files.length === 0) {
      setError(new ApiError(422, "Choisissez au moins un fichier.", "validation_failed"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await upload(name, files);
      setName("");
      setFiles([]);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, files, handleFilesChange, isSubmitting, error, handleSubmit };
}
