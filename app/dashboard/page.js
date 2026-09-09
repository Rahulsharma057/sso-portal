"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography, Grid, Avatar, Stack, Button, CircularProgress } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChecklistIcon from "@mui/icons-material/ChecklistRtl";
import LogoutIcon from "@mui/icons-material/Logout";
import { EXAM_APP_URL, SMS_APP_URL, buildHandoffUrl } from "../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("portal_session");
    if (!raw) {
      router.replace("/login");
      return;
    }
    setSession(JSON.parse(raw));
  }, [router]);

  function openExam() {
    window.location.href = buildHandoffUrl(EXAM_APP_URL, session.exam.token);
  }
  function openSms() {
    window.location.href = buildHandoffUrl(SMS_APP_URL, session.sms.token);
  }
  function logout() {
    localStorage.removeItem("portal_session");
    router.replace("/login");
  }

  if (!session) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 2, sm: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            Choose a system
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Signed in as {session.email}
          </Typography>
        </Box>
        <Button startIcon={<LogoutIcon />} onClick={logout} color="inherit">
          Sign out
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ maxWidth: 800 }}>
        {session.exam?.ok && (
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={openExam}
              sx={{
                p: 3,
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                transition: "all .2s",
                "&:hover": { borderColor: "primary.main", transform: "translateY(-3px)", boxShadow: 4 },
              }}
            >
              <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", width: 56, height: 56, mb: 2 }}>
                <AssessmentIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                Exam ERP
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weekly assessments, results and student performance.
              </Typography>
            </Paper>
          </Grid>
        )}

        {session.sms?.ok && (
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={openSms}
              sx={{
                p: 3,
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                transition: "all .2s",
                "&:hover": { borderColor: "secondary.main", transform: "translateY(-3px)", boxShadow: 4 },
              }}
            >
              <Avatar sx={{ bgcolor: "success.light", color: "success.dark", width: 56, height: 56, mb: 2 }}>
                <ChecklistIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                Task &amp; Report Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily inspection checklists, reports and task tracking.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
