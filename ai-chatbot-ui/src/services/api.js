import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAdapter = async (config) => {
  await sleep(700);

  const url = config?.url || "";
  const method = (config?.method || "get").toLowerCase();

  if (method !== "post") {
    return {
      data: { ok: false, message: "Only POST supported in mock API" },
      status: 405,
      statusText: "Method Not Allowed",
      headers: {},
      config,
      request: null,
    };
  }

  if (url.includes("/ai/remove-background")) {
    return {
      data: { ok: true, message: "Background removed (mock)" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: null,
    };
  }

  if (url.includes("/ai/auto-enhance")) {
    return {
      data: { ok: true, message: "Auto enhance applied (mock)" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: null,
    };
  }

  if (url.includes("/ai/generate-caption")) {
    const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const templateName = body?.templateName || "your design";

    return {
      data: {
        ok: true,
        caption: `A modern poster for ${templateName} — clean, bold, and ready to share.`,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: null,
    };
  }

  return {
    data: { ok: false, message: `Unknown mock endpoint: ${url}` },
    status: 404,
    statusText: "Not Found",
    headers: {},
    config,
    request: null,
  };
};

export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  adapter: mockAdapter,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function removeBackground(payload) {
  const res = await api.post("/ai/remove-background", payload);
  return res.data;
}

export async function autoEnhance(payload) {
  const res = await api.post("/ai/auto-enhance", payload);
  return res.data;
}

export async function generateCaption(payload) {
  const res = await api.post("/ai/generate-caption", payload);
  return res.data;
}
