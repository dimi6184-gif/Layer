"use client";

import { Shield, Lock, Eye } from "lucide-react";

export function PrivacyBadge() {
  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-500 rounded-xl flex-shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            Privacy-First Verification
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              ZERO IP LOGGING
            </span>
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Unlike bots like Double Counter (which redirected users to <code>doublecounter.gg/verify</code> to collect IPs and emails), 
            Layer's verification happens <strong>entirely within Discord</strong>. You never leave the Discord app, so we can't log your IP or location — even if we wanted to.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span><strong>No external website</strong> — verification stays in Discord</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Users never redirected → <strong>No IP address logging possible</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Only stores: User ID (from Discord OAuth, no emails)</span>
            </div>
          </div>

          <a
            href="/security"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-green-700 hover:text-green-800 font-semibold transition-colors"
          >
            Read our full security report →
          </a>
        </div>
      </div>
    </div>
  );
}
