"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startResendCooldown = () => {
    setResendDisabled(true);
    setCountdown(30);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setResendError("");
    startResendCooldown();

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/send-verification-otp?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setResendMsg("Code resent! Check your inbox.");
      } else {
        setResendError(data.message || "Failed to resend code. Try again later.");
      }
    } catch {
      setResendError("Network error. Please check your connection.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Verify your email</h1>
        <p style={styles.subtext}>
          A 6-digit verification code was sent to:
        </p>
        <p style={styles.email}>{email || "your email address"}</p>

        {success ? (
          <p style={styles.successBox}>{success}</p>
        ) : (
          <>
            <label style={styles.label} htmlFor="otp-input">
              Enter OTP
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setError("");
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              placeholder="123456"
              style={styles.input}
            />

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              onClick={handleVerify}
              disabled={loading}
              style={{
                ...styles.verifyBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <div style={styles.resendRow}>
              <span style={styles.resendLabel}>Didn&apos;t receive a code?</span>
              <button
                onClick={handleResend}
                disabled={resendDisabled}
                style={{
                  ...styles.resendBtn,
                  opacity: resendDisabled ? 0.5 : 1,
                  cursor: resendDisabled ? "not-allowed" : "pointer",
                }}
              >
                {resendDisabled ? `Resend code (${countdown}s)` : "Resend code"}
              </button>
            </div>

            {resendMsg && <p style={styles.resendSuccess}>{resendMsg}</p>}
            {resendError && <p style={styles.errorText}>{resendError}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={styles.wrapper}><p>Loading...</p></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#1a1a1a",
  },
  subtext: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
  },
  email: {
    margin: "0 0 8px 0",
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: "15px",
    wordBreak: "break-all",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "2px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "20px",
    letterSpacing: "8px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
  },
  verifyBtn: {
    width: "100%",
    padding: "11px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    borderRadius: "6px",
    marginTop: "4px",
  },
  resendRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    flexWrap: "wrap",
  },
  resendLabel: {
    fontSize: "13px",
    color: "#666",
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    padding: 0,
    textDecoration: "underline",
  },
  resendSuccess: {
    color: "#16a34a",
    fontSize: "13px",
    margin: 0,
  },
  errorText: {
    color: "#dc2626",
    fontSize: "13px",
    margin: 0,
  },
  successBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#15803d",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
  },
};