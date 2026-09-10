"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Stack,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Container,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import ChecklistIcon from "@mui/icons-material/ChecklistRtl";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import {
  EXAM_APP_URL,
  SMS_APP_URL,
  buildHandoffUrl,
} from "../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("portal_session");

    if (!raw) {
      router.replace("/login");
      return;
    }

    try {
      setSession(JSON.parse(raw));
    } catch (error) {
      console.error("Invalid portal session:", error);
      localStorage.removeItem("portal_session");
      router.replace("/login");
    }
  }, [router]);

  function openExam() {
    if (!session?.exam?.token) return;

    window.location.href = buildHandoffUrl(
      EXAM_APP_URL,
      session.exam.token
    );
  }

  function openSms() {
    if (!session?.sms?.token) return;

    window.location.href = buildHandoffUrl(
      SMS_APP_URL,
      session.sms.token
    );
  }

  function logout() {
    localStorage.removeItem("portal_session");
    router.replace("/login");
  }

  if (!session) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f6f8fc",
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  const availableSystems = [
    {
      key: "exam",
      available: session.exam?.ok,
      title: "Exam ERP",
      subtitle: "Assessment & Academic Management",
      description:
        "Manage weekly assessments, examinations, results and student performance from one place.",
      icon: <AssessmentIcon sx={{ fontSize: 26 }} />,
      avatarBg: "#e8f0ff",
      avatarColor: "#2563eb",
      accent: "#2563eb",
      onClick: openExam,
    },
    {
      key: "sms",
      available: session.sms?.ok,
      title: "Task & Report Management",
      subtitle: "Daily Operations & Reporting",
      description:
        "Manage daily inspection checklists, tasks, reports and operational activities.",
      icon: <ChecklistIcon sx={{ fontSize: 26 }} />,
      avatarBg: "#fff0f0",
      avatarColor: "#dc2626",
      accent: "#dc2626",
      onClick: openSms,
    },
  ].filter((system) => system.available);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#f7f9fc",

        "&::before": {
          content: '""',
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0) 70%)",
          top: -140,
          right: -100,
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,38,38,0.07) 0%, rgba(220,38,38,0) 70%)",
          bottom: -120,
          left: -100,
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <Paper
          elevation={0}
          sx={{
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: 1.25,
            mb: { xs: 2.5, md: 3 },
            borderRadius: 2.5,
            border: "1px solid #e5e7eb",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
          >
            {/* Logo / Brand */}
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                }}
              >
                <SchoolIcon sx={{ fontSize: 18 }} />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 13.5, sm: 15 },
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  Management Portal
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Unified system access
                </Typography>
              </Box>
            </Stack>

            {/* User + Logout */}
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {session.email?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      lineHeight: 1.2,
                    }}
                  >
                    {session.email}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.4}
                  >
                    <VerifiedUserIcon
                      sx={{
                        fontSize: 11,
                        color: "#16a34a",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      Signed in
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                size="small"
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                onClick={logout}
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12,
                  py: 0.5,
                  borderColor: "#d1d5db",
                  color: "#374151",
                  minWidth: { xs: 36, sm: 78 },

                  "&:hover": {
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    bgcolor: "#fff5f5",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  Sign out
                </Box>
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* =====================================================
            WELCOME SECTION
        ===================================================== */}
        <Box
          sx={{
            maxWidth: 720,
            mx: "auto",
            textAlign: "center",
            mb: { xs: 2.5, md: 3 },
          }}
        >
          <Chip
            icon={<VerifiedUserIcon sx={{ fontSize: 15 }} />}
            label="Secure Portal Access"
            size="small"
            sx={{
              mb: 1.25,
              height: 24,
              fontSize: 11,
              bgcolor: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #dbeafe",
              fontWeight: 700,
              "& .MuiChip-icon": {
                color: "#2563eb",
              },
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "21px",
                sm: "26px",
                md: "32px",
              },
              lineHeight: 1.15,
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "#111827",
              mb: 0.75,
            }}
          >
            Welcome back
            <Box
              component="span"
              sx={{
                display: { xs: "block", sm: "inline" },
                ml: { xs: 0, sm: 1 },
                background:
                  "linear-gradient(90deg, #2563eb 0%, #dc2626 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              👋
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              fontSize: { xs: 12.5, sm: 13.5 },
              lineHeight: 1.6,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            Hello,{" "}
            <Box
              component="span"
              sx={{
                color: "#111827",
                fontWeight: 700,
              }}
            >
              {session.email}
            </Box>
            . Choose the system you want to access and continue
            managing your work from one centralized portal.
          </Typography>
        </Box>

        {/* =====================================================
            SYSTEM CARDS
        ===================================================== */}
        {availableSystems.length > 0 ? (
          <Grid
            container
            spacing={{ xs: 1.5, md: 2 }}
            justifyContent="center"
            sx={{
              maxWidth: 880,
              mx: "auto",
            }}
          >
            {availableSystems.map((system) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={system.key}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition:
                      "transform .2s ease, box-shadow .2s ease, border-color .2s ease",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 3,
                      bgcolor: system.accent,
                    },

                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: system.accent,
                      boxShadow:
                        "0 12px 30px rgba(15,23,42,0.10)",
                    },
                  }}
                  onClick={system.onClick}
                >
                  <Stack spacing={1.5}>
                    {/* Icon */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: system.avatarBg,
                          color: system.avatarColor,
                          borderRadius: 2,
                        }}
                      >
                        {system.icon}
                      </Avatar>

                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f8fafc",
                          color: "#94a3b8",
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </Stack>

                    {/* Title */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: 16, sm: 17.5 },
                          fontWeight: 800,
                          color: "#111827",
                          mb: 0.25,
                          lineHeight: 1.25,
                        }}
                      >
                        {system.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: system.accent,
                          textTransform: "uppercase",
                          letterSpacing: ".4px",
                        }}
                      >
                        {system.subtitle}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        color: "#6b7280",
                        minHeight: { sm: 40 },
                      }}
                    >
                      {system.description}
                    </Typography>

                    <Divider />

                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      onClick={(event) => {
                        event.stopPropagation();
                        system.onClick();
                      }}
                      sx={{
                        py: 0.85,
                        borderRadius: 1.75,
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: 13,
                        bgcolor: system.accent,
                        boxShadow: "none",

                        "&:hover": {
                          bgcolor: system.accent,
                          filter: "brightness(.92)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Open {system.title}
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* =====================================================
              NO SYSTEM
          ===================================================== */
          <Paper
            elevation={0}
            sx={{
              maxWidth: 480,
              mx: "auto",
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                mx: "auto",
                mb: 1.5,
                bgcolor: "#f3f4f6",
                color: "#6b7280",
              }}
            >
              <AssessmentIcon sx={{ fontSize: 22 }} />
            </Avatar>

            <Typography
              sx={{ fontSize: 15, fontWeight: 800, mb: 0.5 }}
            >
              No system available
            </Typography>

            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              You currently don't have access to any system.
              Please contact your administrator.
            </Typography>
          </Paper>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <Box
          sx={{
            textAlign: "center",
            mt: { xs: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            Secure access • Unified Management Portal
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}