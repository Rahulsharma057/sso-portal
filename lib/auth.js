import axios from "axios";

const examClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXAM_API_URL,
  withCredentials: true,
});

const smsClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SMS_API_URL,
  withCredentials: true,
});

export const EXAM_APP_URL = process.env.NEXT_PUBLIC_EXAM_APP_URL;
export const SMS_APP_URL = process.env.NEXT_PUBLIC_SMS_APP_URL;

/**
 * Tries to log the given credentials into BOTH backends in parallel.
 * A user only needs matching email/password on the systems they actually
 * have accounts on - a failed login on one system is not an error, it just
 * means that tile won't be offered.
 *
 * Returns:
 *   {
 *     exam: { ok: true, token, user } | { ok: false, error },
 *     sms:  { ok: true, token, user } | { ok: false, error },
 *   }
 */
export async function loginToBoth(email, password) {
  const [examResult, smsResult] = await Promise.allSettled([
    examClient.post("/auth/login", { email, password }),
    smsClient.post("/auth/login", { email, password }),
  ]);

  return {
    exam: normalize(examResult),
    sms: normalize(smsResult),
  };
}

function normalize(settledResult) {
  if (settledResult.status === "fulfilled") {
    const data = settledResult.value.data;
    // Exam ERP returns { token, user }; SMS returns { token, user } too (from AuthContext).
    if (data?.token) {
      return { ok: true, token: data.token, user: data.user || null };
    }
    return { ok: false, error: "No token returned" };
  }
  const reason = settledResult.reason;
  const message =
    reason?.response?.data?.message || reason?.message || "Login failed";
  return { ok: false, error: message };
}

/**
 * Builds the handoff URL that logs the user straight into a target app.
 * The target app must have the /sso receiver page installed (see
 * add-to-exam-erp/ and add-to-sms-app/ in this delivery).
 */
export function buildHandoffUrl(appBaseUrl, token) {
  const url = new URL("/sso", appBaseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
