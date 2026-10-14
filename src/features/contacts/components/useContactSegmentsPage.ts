import { useCallback, useEffect, useState } from "react";
import * as contactsApi from "@/features/contacts/api";
import { ApiError } from "@/lib/api/errors";
import type { Contact, ContactSegment, SegmentCriterion } from "@/features/contacts/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Écran `/contacts/segments` : la liste, et les contacts de chaque segment consulté. */
export function useContactSegmentsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [segments, setSegments] = useState<ContactSegment[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [expandedSegmentId, setExpandedSegmentId] = useState<string | null>(null);
  const [segmentContacts, setSegmentContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await contactsApi.listSegments();
      setSegments(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(name: string, criteria: SegmentCriterion[]) {
    const { data } = await contactsApi.createSegment(name, criteria);
    setSegments((current) => [...current, data]);
  }

  async function update(id: string, name: string, criteria: SegmentCriterion[]) {
    const { data } = await contactsApi.updateSegment(id, name, criteria);
    setSegments((current) => current.map((segment) => (segment.id === id ? data : segment)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await contactsApi.deleteSegment(id);
      setSegments((current) => current.filter((segment) => segment.id !== id));
      if (expandedSegmentId === id) {
        setExpandedSegmentId(null);
      }
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function toggleContacts(id: string) {
    if (expandedSegmentId === id) {
      setExpandedSegmentId(null);
      return;
    }

    setActionError(null);
    setExpandedSegmentId(id);
    setIsLoadingContacts(true);
    try {
      const { data } = await contactsApi.segmentContacts(id);
      setSegmentContacts(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      setExpandedSegmentId(null);
    } finally {
      setIsLoadingContacts(false);
    }
  }

  return {
    loadState,
    segments,
    actionError,
    create,
    update,
    remove,
    expandedSegmentId,
    segmentContacts,
    isLoadingContacts,
    toggleContacts,
  };
}
