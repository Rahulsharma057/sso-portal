"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  loginToBoth,
  EXAM_APP_URL,
  SMS_APP_URL,
  buildHandoffUrl,
} from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginToBoth(email, password);

      if (!result.exam.ok && !result.sms.ok) {
        setError("Incorrect email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "portal_session",
        JSON.stringify({
          ...result,
          email,
        })
      );

      const accessible = [
        result.exam.ok ? "exam" : null,
        result.sms.ok ? "sms" : null,
      ].filter(Boolean);

      if (accessible.length === 1) {
        const target = accessible[0];

        const url =
          target === "exam"
            ? buildHandoffUrl(EXAM_APP_URL, result.exam.token)
            : buildHandoffUrl(SMS_APP_URL, result.sms.token);

        window.location.href = url;
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(
        err?.message || "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",

        backgroundImage: `
          linear-gradient(
            rgba(8, 25, 48, 0.58),
            rgba(8, 25, 48, 0.68)
          ),
          url("/images/login-bg.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        px: { xs: 1.5, sm: 2 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* Soft Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Login Card */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,

          width: "100%",
          maxWidth: 390,

          p: {
            xs: 2.25,
            sm: 3,
          },

          borderRadius: 2.5,

          backgroundColor: "rgba(255,255,255,0.97)",

          border: "1px solid rgba(255,255,255,0.85)",

          boxShadow:
            "0 18px 50px rgba(0,0,0,0.25)",

          backdropFilter: "blur(8px)",
        }}
      >
        {/* Organization */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 21,
                sm: 24,
              },
              fontWeight: 900,
              color: "#163A63",
              lineHeight: 1.2,
            }}
          >
            Sleepwell Foundation
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: {
                xs: 12.5,
                sm: 13.5,
              },
              fontWeight: 700,
              color: "#667085",
            }}
          >
            Skill Development Centre
          </Typography>

          <Divider
            sx={{
              width: 60,
              mx: "auto",
              mt: 1.25,
              borderColor: "#DCE3EA",
            }}
          />
        </Box>

        {/* Login Heading */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 1.75,
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#163A63",
              mb: 1,

              boxShadow:
                "0 6px 18px rgba(22,58,99,0.25)",
            }}
          >
            <LockOutlinedIcon fontSize="small" />
          </Avatar>

          <Typography
            sx={{
              fontSize: {
                xs: 20,
                sm: 22,
              },
              fontWeight: 800,
              color: "#1D2939",
              lineHeight: 1.2,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 12.5,
              color: "#667085",
            }}
          >
            Sign in to access your portal
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              py: 0.25,
              borderRadius: 1.25,
              fontSize: 13,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            size="small"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.25,
                backgroundColor: "#FAFBFC",
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            size="small"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.25,
                backgroundColor: "#FAFBFC",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setShowPassword((s) => !s)
                    }
                    edge="end"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.05,

              borderRadius: 1.25,

              fontSize: 14,
              fontWeight: 800,

              textTransform: "none",

              backgroundColor: "#163A63",

              boxShadow:
                "0 6px 16px rgba(22,58,99,0.22)",

              "&:hover": {
                backgroundColor: "#0F2D4D",
              },

              "&.Mui-disabled": {
                backgroundColor: "#AAB7C5",
                color: "#fff",
              },
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              color: "#667085",
              lineHeight: 1.5,
            }}
          >
            One login for Exam ERP and Task &amp; Report
            Management
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              fontSize: 10.5,
              color: "#98A2B3",
              lineHeight: 1.4,
            }}
          >
            If you have access to only one system,
            <br />
            you&apos;ll be taken there automatically.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}