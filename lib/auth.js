import axios from "axios";

const examClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXAM_API_URL,
  withCredentials: true,
  timeout: 15000,
});

const smsClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SMS_API_URL,
  withCredentials: true,
  timeout: 15000,
});

export const EXAM_APP_URL = process.env.NEXT_PUBLIC_EXAM_APP_URL;
export const SMS_APP_URL = process.env.NEXT_PUBLIC_SMS_APP_URL;

// ============================================================
// LOGIN TO BOTH SYSTEMS - PARALLEL
// ============================================================

export async function loginToBoth(email, password) {
  const credentials = {
    email: email.trim(),
    password,
  };

  // IMPORTANT:
  // Both requests start at exactly the same time.
  const examPromise = loginExam(credentials);
  const smsPromise = loginSms(credentials);

  // One backend failing will NOT reject the whole login.
  const [exam, sms] = await Promise.all([examPromise, smsPromise]);

  return {
    exam,
    sms,
  };
}

// ============================================================
// EXAM LOGIN
// ============================================================

async function loginExam(credentials) {
  try {
    const response = await examClient.post(
      "/auth/login",
      credentials
    );

    return normalizeSuccess(response);
  } catch (error) {
    return normalizeError(error);
  }
}

// ============================================================
// SMS LOGIN
// ============================================================

async function loginSms(credentials) {
  try {
    const response = await smsClient.post(
      "/auth/login",
      credentials
    );

    return normalizeSuccess(response);
  } catch (error) {
    return normalizeError(error);
  }
}

// ============================================================
// RESPONSE NORMALIZATION
// ============================================================

function normalizeSuccess(response) {
  const data = response?.data;

  if (data?.token) {
    return {
      ok: true,
      token: data.token,
      user: data.user || null,
    };
  }

  return {
    ok: false,
    error: data?.message || "No token returned",
  };
}

function normalizeError(error) {
  return {
    ok: false,
    error:
      error?.response?.data?.message ||
      error?.message ||
      "Login failed",
  };
}

// ============================================================
// SSO HANDOFF
// ============================================================

export function buildHandoffUrl(appBaseUrl, token) {
  if (!appBaseUrl || !token) {
    return null;
  }

  const url = new URL("/sso", appBaseUrl);

  url.searchParams.set("token", token);

  return url.toString();
}