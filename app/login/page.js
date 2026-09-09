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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { loginToBoth, EXAM_APP_URL, SMS_APP_URL, buildHandoffUrl } from "../../lib/auth";

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

      localStorage.setItem("portal_session", JSON.stringify({ ...result, email }));

      const accessible = [result.exam.ok ? "exam" : null, result.sms.ok ? "sms" : null].filter(Boolean);

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
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, width: "100%", maxWidth: 420 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", mb: 1.5 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={800} color="primary.main" textAlign="center">
            Sleepwell Foundation Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
            One login for Exam ERP and Task &amp; Report Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.3 }}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
          Only have access to one system? You&apos;ll be taken straight there — no extra step.
        </Typography>
      </Paper>
    </Box>
  );
}
