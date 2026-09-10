import { api_rotinaplus } from "./api";

function extractTasks(data) {
  return data?.result ?? data?.response ?? [];
}

async function requestTasks(request) {
  try {
    const response = await request;
    return extractTasks(response.data);
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
}

export async function getAllTasks() {
  return requestTasks(api_rotinaplus.get("/api/tasks"));
}

export async function getTasksByUser(userId) {
  return requestTasks(api_rotinaplus.get(`/api/tasks/${userId}`));
}
