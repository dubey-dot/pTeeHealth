import type { IntakeOptions } from "@/types/intake";

const API_BASE = "/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Request to ${path} failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

export const intakeApi = {
  getOptions: () => request<IntakeOptions>("/intake/options"),

  create: (payload: Record<string, unknown>) =>
    request("/intake", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  requestSeniorReview: (intakeId: string, reason?: string) =>
    request("/intake/senior-review", {
      method: "POST",
      body: JSON.stringify({ intake_id: intakeId, reason }),
    }),

  extractFromTranscript: (transcript: string) =>
    request("/intake/voice-transcript", {
      method: "POST",
      body: JSON.stringify({ transcript }),
    }),
};
