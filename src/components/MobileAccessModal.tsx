import React, { useState } from 'react';
import { Smartphone, QrCode, Copy, Check, Download, ExternalLink, Share2, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use active ais-dev URL which is live right now
  const devUrl = 'https://ais-dev-ccq3pvzcl7q6qjljmjjzdm-466719036781.asia-southeast1.run.app';
  const sharedUrl = 'https://ais-pre-ccq3pvzcl7q6qjljmjjzdm-466719036781.asia-southeast1.run.app';
  
  const [selectedUrlType, setSelectedUrlType] = useState<'dev' | 'shared'>('dev');
  const appUrl = selectedUrlType === 'dev' ? devUrl : sharedUrl;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&bgcolor=0f172a&color=38bdf8&data=${encodeURIComponent(appUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-sky-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Open PrePilot on Mobile</h3>
            <p className="text-xs text-slate-400">Scan QR or open the link directly on your Android phone</p>
          </div>
        </div>

        {/* URL Type Selector */}
        <div className="flex p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedUrlType('dev')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              selectedUrlType === 'dev' 
                ? 'bg-sky-500 text-slate-950 font-bold shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Dev Link (Active Now)
          </button>
          <button
            onClick={() => setSelectedUrlType('shared')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              selectedUrlType === 'shared' 
                ? 'bg-purple-500 text-white font-bold shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Shared Link
          </button>
        </div>

        {selectedUrlType === 'dev' ? (
          <div className="mb-3 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-[11px] text-sky-200">
            <strong>Active Live URL:</strong> Open this URL in Chrome on your phone. If prompted, sign in with your Google Account (<code className="text-sky-300 font-mono">lakshmeeshake37@gmail.com</code>).
          </div>
        ) : (
          <div className="mb-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-[11px] text-purple-200">
            <strong>Public Shared URL:</strong> To activate this link without any Google sign-in required, click the <strong>"Share"</strong> button in the top-right corner of Google AI Studio!
          </div>
        )}

        {/* QR Code Container */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="relative p-2 bg-slate-900 rounded-xl border border-sky-500/30 shadow-inner">
            <img
              src={qrImageUrl}
              alt="Scan QR code to open PrePilot on Mobile"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            Point your phone's camera at this QR code to launch PrePilot
          </span>
        </div>

        {/* Direct Link & Copy */}
        <div className="mt-4">
          <label className="text-[11px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
            Mobile App Web Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-sky-300 truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-md shadow-sky-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Install as Native App Instructions for Android and iOS */}
        <div className="mt-5 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Download className="w-4 h-4 text-sky-400" />
              <span>Mobile Installation Guide:</span>
            </div>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded text-sky-400 font-bold">Android & iOS Supported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {/* Android Instructions */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>🤖 Android (Google Chrome)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>Open this URL in <strong>Google Chrome</strong>.</li>
                <li>Tap the <strong>three dots (⋮)</strong> at top-right.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>Launches as a standalone app with full offline mode!</li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
              <div className="font-bold text-sky-400 flex items-center gap-1.5">
                <span>🍏 iOS / iPhone (Safari)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>Open this URL in <strong>Apple Safari</strong>.</li>
                <li>Tap the <strong>Share button (⎋ / square with arrow)</strong>.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                <li>PrePilot icon will appear on your iPhone home screen!</li>
              </ol>
            </div>
          </div>

          {/* In-app trigger if opened directly on mobile */}
          {isInstallable && (
            <button
              onClick={install}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Install PrePilot on This Device Now</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center font-semibold">
              ✓ Running in Installed Standalone Mobile Mode
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
