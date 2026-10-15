import { useState } from "react";
import * as automationsApi from "@/features/automations/api";
import { ApiError } from "@/lib/api/errors";
import type { AutomationTestResult } from "@/features/automations/types";

export function useAutomationScenarioTester(scenarioId: string) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");
  const [result, setResult] = useState<AutomationTestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function run() {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await automationsApi.testAutomation(scenarioId, message, channel || undefined);
      setResult(data);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsRunning(false);
    }
  }

  return { message, setMessage, channel, setChannel, result, isRunning, error, run };
}
