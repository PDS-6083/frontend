const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
  return data;
}

export async function apiLogin(body: {
  user_type: "admin" | "crew" | "scheduler" | "engineer";
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Login failed");

  return data;
}

export function getAdminDashboard() {
  return apiGet("/api/admin/dashboard-summary");
}

export function getCrewSchedule() {
  return apiGet("/api/crew/my-schedule");
}

export function getEngineerJobs() {
  return apiGet("/api/engineer/my-jobs");
}

export function getSchedulerOverview() {
  return apiGet("/api/scheduler/overview");
}