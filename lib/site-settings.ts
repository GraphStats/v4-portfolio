export const DEFAULT_DEVELOPER_NAME = "No Name"

export function normalizeDeveloperName(value?: string | null) {
  const trimmed = (value || "").trim()
  return trimmed.length > 0 ? trimmed : DEFAULT_DEVELOPER_NAME
}
