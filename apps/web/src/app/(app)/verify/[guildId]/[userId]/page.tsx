// apps/web/src/app/(app)/verify/[guildId]/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Shield, CheckCircle2, XCircle } from "lucide-react";

// Generate persistent verification ID
function getOrCreateVerificationId(): string {
  const key = 'layer_verification_id';
  let verificationId = localStorage.getItem(key);
  
  if (!verificationId) {
    // Generate cryptographically random ID
    verificationId = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem(key, verificationId);
  }
  
  return verificationId;
}

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your device...");

  useEffect(() => {
    const verifyFingerprint = async () => {
      try {
        // Get persistent verification ID
        const verificationId = getOrCreateVerificationId();
        
        // Dynamically import ThumbmarkJS (client-side only)
        const ThumbmarkJS = await import("@thumbmarkjs/thumbmarkjs");
        const tm = new ThumbmarkJS.Thumbmark({
          logging: false,
          collect_beacon: false,
        });

        // Get fingerprint
        const result = await tm.get();
        
        // Send to API with verification ID
        const response = await fetch("/api/fingerprint/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: params.userId,
            guildId: params.guildId,
            fingerprint: result.hash,
            components: {
              ...result.components,
              verificationId, // Add persistent ID
            },
          }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Verification complete! You can close this page now.");
          
          // Redirect after 3 seconds
          setTimeout(() => {
            window.close();
          }, 3000);
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Verification failed. Please try again or contact support.");
      }
    };

    verifyFingerprint();
  }, [params]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/[0.04] rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300/[0.02] rounded-full blur-3xl animate-float-fast"></div>
      </div>

      <div className="max-w-md w-full relative z-10 text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/logo.png" alt="Layer" className="w-16 h-16 rounded-2xl" />
        </div>

        {/* Status Icon */}
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
        </div>

        {/* Title & Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            {status === "loading" && "Device Verification"}
            {status === "success" && "Verification Complete!"}
            {status === "error" && "Verification Failed"}
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Info */}
        {status === "loading" && (
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3 text-left">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1">Privacy First</p>
                <p className="text-gray-600">
                  We only collect anonymous device information to keep the server safe. 
                  No personal data is stored.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-sm text-gray-500">
            Redirecting in 3 seconds...
          </div>
        )}
      </div>
    </div>
  );
}
