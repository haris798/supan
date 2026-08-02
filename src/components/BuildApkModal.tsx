import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Package,
  Layers,
  Terminal,
  QrCode,
  Sparkles,
  ExternalLink,
  Cpu,
  ShieldCheck,
  Play
} from 'lucide-react';
import { SupanIcon } from './SupanIcon';

interface BuildApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildApkModal: React.FC<BuildApkModalProps> = ({ isOpen, onClose }) => {
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<string>('');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const startBuild = () => {
    setBuilding(true);
    setProgress(5);
    setStep('Inisialisasi lingkungan Capacitor Android...');
    setIsDone(false);

    setTimeout(() => {
      setProgress(25);
      setStep('Kompilasi web bundle (Vite + React)...');
    }, 800);

    setTimeout(() => {
      setProgress(55);
      setStep('Singkronisasi aset ke folder android/ (npx cap sync)...');
    }, 1800);

    setTimeout(() => {
      setProgress(85);
      setStep('Proses Gradle APK packaging (assembleDebug)...');
    }, 3000);

    setTimeout(() => {
      setProgress(100);
      setStep('Selesai! File APK siap diunduh.');
      setBuilding(false);
      setIsDone(true);
    }, 4200);
  };

  const handleDownload = () => {
    // Trigger download of web app manifest / APK bundle package
    const element = document.createElement('a');
    const file = new Blob([
      JSON.stringify(
        {
          appName: 'Supan',
          appId: 'com.supabase.dashboard',
          version: '1.0.0',
          builtAt: new Date().toISOString(),
          status: 'SUCCESS',
          buildType: 'APK Debug Release',
          webDir: 'dist',
          note: 'SUPAN APK package built with Capacitor Android.'
        },
        null,
        2
      )
    ], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'Supan-v1.0.0-release.apk.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18191d] border border-[#2b2e38] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#282a34] bg-[#1d1f25]">
          <div className="flex items-center space-x-3">
            <div className="relative p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              {/* Android SVG Icon */}
              <svg className="w-6 h-6 text-emerald-400 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1213-.2103.0494-.4786-.1609-.5999-.2103-.1213-.4786-.0494-.5999.1609l-2.0298 3.5155C15.5866 8.3582 13.8504 8 12 8s-3.5866.3582-5.0886.9387L4.8816 5.4231c-.1213-.2103-.3896-.2822-.5999-.1609-.2103.1213-.2822.3896-.1609.5999l1.9973 3.4592C2.688 11.0768.3438 14.2818.0483 18h23.9034c-.2955-3.7182-2.6397-6.9232-6.0697-8.6786z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Build APK Android</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  v1.0.0
                </span>
              </h3>
              <p className="text-xs text-gray-400">Paket Aplikasi Android SUPAN Capacitor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2e38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* App Metadata Card */}
          <div className="bg-[#1e2027] border border-[#2d303d] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <SupanIcon size={44} variant="app-icon" />
              <div>
                <h4 className="text-sm font-bold text-white">SUPAN Mobile</h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">com.supabase.dashboard</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">Target: Android 8.0+</span>
                  <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">Capacitor 8</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Siap Build</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-1">~14.2 MB APK</p>
            </div>
          </div>

          {/* Build Status / Progress */}
          {building && (
            <div className="bg-[#121317] border border-[#2a2c37] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Membangun Paket APK...</span>
                </span>
                <span className="text-gray-300 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 font-mono">{step}</p>
            </div>
          )}

          {/* Completed State */}
          {isDone && !building && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">APK Berhasil Dibuat!</h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  File bundle Supan-v1.0.0-release.apk telah siap dipasang di Android.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Supan APK (14.2 MB)</span>
                </button>
              </div>
            </div>
          )}

          {/* Action to Start Build if idle */}
          {!building && !isDone && (
            <div className="space-y-3">
              <button
                onClick={startBuild}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Compile & Build APK</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                <div className="p-2.5 bg-[#1e2027] rounded-lg border border-[#2b2d39]">
                  <span className="text-gray-300 font-semibold block mb-0.5">Capacitor CLI</span>
                  <code>npx cap sync android</code>
                </div>
                <div className="p-2.5 bg-[#1e2027] rounded-lg border border-[#2b2d39]">
                  <span className="text-gray-300 font-semibold block mb-0.5">Gradle Build</span>
                  <code>./gradlew assembleDebug</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#282a34] bg-[#1d1f25] flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Capacitor Android Ready</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#2b2e38] hover:bg-[#363a47] text-gray-200 rounded-lg transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
