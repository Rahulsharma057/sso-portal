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
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",

        // Background image
        backgroundImage: `
          linear-gradient(
            rgba(8, 25, 48, 0.62),
            rgba(8, 25, 48, 0.72)
          ),
          url("/images/login-bg.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      {/* Background decorative overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 35%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 35%)",
          pointerEvents: "none",
        }}
      />

      {/* Login Card */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 440,

          p: {
            xs: 3,
            sm: 4,
          },

          borderRadius: 3,

          backgroundColor: "rgba(255, 255, 255, 0.97)",

          border: "1px solid rgba(255,255,255,0.8)",

          boxShadow:
            "0 24px 70px rgba(0, 0, 0, 0.28)",

          backdropFilter: "blur(10px)",
        }}
      >
        {/* Organization Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 24,
                sm: 28,
              },
              fontWeight: 900,
              color: "#163A63",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            Sleepwell Foundation
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: {
                xs: 14,
                sm: 15,
              },
              fontWeight: 700,
              color: "#6A7480",
              letterSpacing: "0.3px",
            }}
          >
            Skill Development Centre
          </Typography>

          <Divider
            sx={{
              mt: 2,
              mx: "auto",
              width: 80,
              borderColor: "#DCE3EA",
            }}
          />
        </Box>

        {/* Login Icon */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Avatar
            sx={{
              width: 62,
              height: 62,
              bgcolor: "#163A63",
              mb: 1.5,
              boxShadow:
                "0 8px 22px rgba(22, 58, 99, 0.25)",
            }}
          >
            <LockOutlinedIcon fontSize="medium" />
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#1D2939",
              textAlign: "center",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "#667085",
              textAlign: "center",
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
              mb: 2,
              borderRadius: 1.5,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                backgroundColor: "#FAFBFC",
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                backgroundColor: "#FAFBFC",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
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
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
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
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.35,

              borderRadius: 1.5,

              fontSize: 15,
              fontWeight: 800,

              textTransform: "none",

              backgroundColor: "#163A63",

              boxShadow:
                "0 8px 20px rgba(22, 58, 99, 0.25)",

              "&:hover": {
                backgroundColor: "#0F2D4D",
                boxShadow:
                  "0 10px 24px rgba(22, 58, 99, 0.32)",
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

        {/* Footer Information */}
        <Box
          sx={{
            mt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#667085",
              lineHeight: 1.6,
            }}
          >
            One login for Exam ERP and
            <br />
            Task &amp; Report Management
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1.5,
              color: "#98A2B3",
              lineHeight: 1.5,
            }}
          >
            Only have access to one system?
            <br />
            You&apos;ll be taken straight there.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}