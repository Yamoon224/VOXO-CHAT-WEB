"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useWidgetSettingsForm } from "@/features/widget/components/useWidgetSettingsForm";
import type { WidgetPosition, WidgetSettings } from "@/features/widget/types";

const POSITION_OPTIONS: { value: WidgetPosition; label: string }[] = [
  { value: "bottom_right", label: "En bas à droite" },
  { value: "bottom_left", label: "En bas à gauche" },
];

const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function WidgetSettingsForm({
  settings,
  update,
}: {
  settings: WidgetSettings;
  update: (payload: Partial<WidgetSettings>) => Promise<void>;
}) {
  const {
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
  } = useWidgetSettingsForm(settings, update);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Couleur principale"
          type="text"
          value={primaryColor}
          onChange={(event) => setPrimaryColor(event.target.value)}
          hint="Format hexadécimal, ex. #4F46E5"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="widget-position" className="text-sm font-medium text-foreground">
            Position
          </label>
          <select
            id="widget-position"
            value={position}
            onChange={(event) => setPosition(event.target.value as WidgetPosition)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            {POSITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Field
        label="Message d'accueil"
        value={welcomeMessage}
        onChange={(event) => setWelcomeMessage(event.target.value)}
      />

      <Field
        label="Message hors horaires"
        value={offlineMessage}
        onChange={(event) => setOfflineMessage(event.target.value)}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Horaires d&apos;ouverture</p>
        <div className="flex flex-col gap-1.5">
          {days.map((row) => (
            <div key={row.day} className="flex flex-wrap items-center gap-3">
              <label className="flex w-36 items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={row.open} onChange={(event) => toggleDay(row.day, event.target.checked)} />
                {DAY_LABELS[row.day]}
              </label>
              <input
                type="time"
                disabled={!row.open}
                value={row.opensAt}
                onChange={(event) => setDayTime(row.day, "opensAt", event.target.value)}
                className="rounded-md border border-border-strong bg-surface px-2 py-1 text-sm text-foreground disabled:opacity-50"
              />
              <span className="text-sm text-muted">à</span>
              <input
                type="time"
                disabled={!row.open}
                value={row.closesAt}
                onChange={(event) => setDayTime(row.day, "closesAt", event.target.value)}
                className="rounded-md border border-border-strong bg-surface px-2 py-1 text-sm text-foreground disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
