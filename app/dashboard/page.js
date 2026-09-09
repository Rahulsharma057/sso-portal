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
        <CircularProgress />
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
        "Manage weekly assessments, examinations, results, student performance and academic reports from one place.",
      icon: <AssessmentIcon sx={{ fontSize: 34 }} />,
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
        "Manage daily inspection checklists, tasks, reports and operational activities efficiently.",
      icon: <ChecklistIcon sx={{ fontSize: 34 }} />,
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
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0) 70%)",
          top: -180,
          right: -120,
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,38,38,0.07) 0%, rgba(220,38,38,0) 70%)",
          bottom: -160,
          left: -120,
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 2, sm: 3, md: 5 },
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <Paper
          elevation={0}
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 2,
            mb: { xs: 4, md: 6 },
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            {/* Logo / Brand */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                }}
              >
                <SchoolIcon />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 15, sm: 17 },
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  Management Portal
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#6b7280",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Unified system access
                </Typography>
              </Box>
            </Stack>

            {/* User + Logout */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {session.email?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    {session.email}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <VerifiedUserIcon
                      sx={{
                        fontSize: 13,
                        color: "#16a34a",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 11,
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
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#d1d5db",
                  color: "#374151",
                  minWidth: { xs: 40, sm: 90 },

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
            maxWidth: 850,
            mx: "auto",
            textAlign: "center",
            mb: { xs: 4, md: 5 },
          }}
        >
          <Chip
            icon={<VerifiedUserIcon />}
            label="Secure Portal Access"
            size="small"
            sx={{
              mb: 2,
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
                xs: "28px",
                sm: "36px",
                md: "46px",
              },
              lineHeight: 1.15,
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "#111827",
              mb: 1.5,
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
              fontSize: { xs: 14, sm: 16 },
              lineHeight: 1.7,
              maxWidth: 650,
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
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            sx={{
              maxWidth: 1000,
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
                    p: { xs: 2.5, sm: 3.5 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition:
                      "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 4,
                      bgcolor: system.accent,
                    },

                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: system.accent,
                      boxShadow:
                        "0 18px 45px rgba(15,23,42,0.10)",
                    },
                  }}
                  onClick={system.onClick}
                >
                  <Stack spacing={2.5}>
                    {/* Icon */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: system.avatarBg,
                          color: system.avatarColor,
                          borderRadius: 2.5,
                        }}
                      >
                        {system.icon}
                      </Avatar>

                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f8fafc",
                          color: "#94a3b8",
                          transition: ".2s",
                        }}
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </Box>
                    </Stack>

                    {/* Title */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: 20, sm: 22 },
                          fontWeight: 800,
                          color: "#111827",
                          mb: 0.5,
                        }}
                      >
                        {system.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: system.accent,
                          textTransform: "uppercase",
                          letterSpacing: ".5px",
                        }}
                      >
                        {system.subtitle}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#6b7280",
                        minHeight: { sm: 72 },
                      }}
                    >
                      {system.description}
                    </Typography>

                    <Divider />

                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        system.onClick();
                      }}
                      sx={{
                        py: 1.25,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: 14,
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
              maxWidth: 650,
              mx: "auto",
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                bgcolor: "#f3f4f6",
                color: "#6b7280",
              }}
            >
              <AssessmentIcon />
            </Avatar>

            <Typography
              variant="h6"
              fontWeight={800}
              gutterBottom
            >
              No system available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
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
            mt: { xs: 5, md: 7 },
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
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