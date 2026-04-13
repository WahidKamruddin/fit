"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#F9F9F9", fontFamily: "Nunito, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 2rem",
          }}
        >
          <div style={{ maxWidth: "560px", width: "100%" }}>

            {/* Overline */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.55em", textTransform: "uppercase", color: "#CDB38F" }}>
                Error
              </span>
              <div style={{ width: "2rem", height: "1px", backgroundColor: "#CDB38F" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.55em", textTransform: "uppercase", color: "#CDB38F" }}>
                Critical
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                color: "#634832",
                lineHeight: 1.0,
                fontSize: "clamp(3.2rem, 7vw, 5.5rem)",
                margin: 0,
              }}
            >
              Something went<br />
              <span style={{ fontStyle: "italic", color: "#A28769" }}>wrong.</span>
            </h1>

            {/* Divider */}
            <div style={{ marginTop: "2rem", width: "4rem", height: "1px", backgroundColor: "#D9D0C1" }} />

            {/* Body */}
            <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#A28769", lineHeight: 1.7, maxWidth: "18rem" }}>
              A critical error occurred. You can try reloading or return to the home page.
            </p>

            {/* Error digest */}
            {error.digest && (
              <p style={{ marginTop: "0.75rem", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#D9D0C1" }}>
                Ref: {error.digest}
              </p>
            )}

            {/* CTAs */}
            <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  backgroundColor: "#634832",
                  color: "#E9DDC8",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  border: "1px solid #CDB38F",
                  color: "#A28769",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
