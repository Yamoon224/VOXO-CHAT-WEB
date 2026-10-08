import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { BusinessHourSlot, WidgetPosition, WidgetSettings } from "@/features/widget/types";

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export type DayRow = { day: number; open: boolean; opensAt: string; closesAt: string };

function rowsFromSlots(slots: BusinessHourSlot[] | null): DayRow[] {
  return DAYS.map((day) => {
    const slot = slots?.find((candidate) => candidate.day === day);

    return { day, open: slot !== undefined, opensAt: slot?.opens_at ?? "09:00", closesAt: slot?.closes_at ?? "18:00" };
  });
}

export function useWidgetSettingsForm(settings: WidgetSettings, update: (payload: Partial<WidgetSettings>) => Promise<void>) {
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
  const [position, setPosition] = useState<WidgetPosition>(settings.position);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcome_message ?? "");
  const [offlineMessage, setOfflineMessage] = useState(settings.offline_message ?? "");
  const [days, setDays] = useState<DayRow[]>(rowsFromSlots(settings.business_hours));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function toggleDay(day: number, open: boolean) {
    setDays((current) => current.map((row) => (row.day === day ? { ...row, open } : row)));
  }

  function setDayTime(day: number, field: "opensAt" | "closesAt", value: string) {
    setDays((current) => current.map((row) => (row.day === day ? { ...row, [field]: value } : row)));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const businessHours: BusinessHourSlot[] = days
      .filter((row) => row.open)
      .map((row) => ({ day: row.day, opens_at: row.opensAt, closes_at: row.closesAt }));

    try {
      await update({
        primary_color: primaryColor,
        position,
        welcome_message: welcomeMessage || null,
        offline_message: offlineMessage || null,
        business_hours: businessHours.length > 0 ? businessHours : null,
      });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    primaryColor,
    setPrimaryColor,
    position,
    setPosition,
    welcomeMessage,
    setWelcomeMessage,
    offlineMessage,
    setOfflineMessage,
    days,
    toggleDay,
    setDayTime,
    isSubmitting,
    error,
    handleSubmit,
  };
}
