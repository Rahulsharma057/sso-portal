"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { EXAM_APP_URL, SMS_APP_URL, buildHandoffUrl } from "../lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("portal_session");
    if (!raw) {
      router.replace("/login");
      return;
    }

    const session = JSON.parse(raw);
    const accessible = [
      session.exam?.ok ? "exam" : null,
      session.sms?.ok ? "sms" : null,
    ].filter(Boolean);

    if (accessible.length === 0) {
      localStorage.removeItem("portal_session");
      router.replace("/login");
    } else if (accessible.length === 1) {
      // Only one system - skip the chooser entirely, go straight in.
      const target = accessible[0];
      const url =
        target === "exam"
          ? buildHandoffUrl(EXAM_APP_URL, session.exam.token)
          : buildHandoffUrl(SMS_APP_URL, session.sms.token);
      window.location.href = url;
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
