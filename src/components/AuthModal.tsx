import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Phone,
  KeyRound,
  RotateCcw,
  Check,
  Gift,
  Flame,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Registration / Login inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Development Engineer (SDE)');
  const [college, setCollege] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [dailyHours, setDailyHours] = useState(2);

  // OTP Forgot Password States
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request_otp' | 'verify_otp' | 'new_password'>('request_otp');
  const [activeOtp, setActiveOtp] = useState('');
  const [simulatedOtpDisplay, setSimulatedOtpDisplay] = useState<string | null>(null);
  const [otpDestination, setOtpDestination] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const stats = StorageService.getEarlyBirdStats();

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, otpTimer]);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = StorageService.registerUser(
      fullName,
      email,
      password,
      targetRole,
      college,
      driveDate,
      dailyHours,
      phone
    );

    if (!result.success) {
      setError(result.error || 'Registration failed');
    } else if (result.user) {
      onLoginSuccess(result.user);
      onClose();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = StorageService.loginUser(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    } else if (result.user) {
      onLoginSuccess(result.user);
      onClose();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const res = StorageService.generateOtp(forgotIdentifier);
    if (!res.success) {
      setError(res.error || 'Could not find registered account.');
      return;
    }

    setOtpDestination(res.destination || forgotIdentifier);
    setSimulatedOtpDisplay(res.otp || null);
    setForgotStep('verify_otp');
    setOtpTimer(30);
    setIsTimerRunning(true);
    setNotice(`Verification code sent to ${res.destination}!`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = StorageService.verifyOtp(activeOtp);
    if (!res.success) {
      setError(res.error || 'Incorrect OTP code.');
      return;
    }

    setForgotStep('new_password');
    setNotice('OTP verified! Enter your new password below.');
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = StorageService.resetPasswordWithOtp(activeOtp, newPassword);
    if (!res.success) {
      setError(res.error || 'Password reset failed.');
      return;
    }

    setNotice('Password updated successfully! You can now sign in.');
    setMode('login');
    setEmail(forgotIdentifier);
    setPassword(newPassword);
    setForgotStep('request_otp');
    setActiveOtp('');
    setSimulatedOtpDisplay(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative my-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>

        {/* Branding header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 mb-2.5">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Sign In to PrePilot' : mode === 'register' ? 'Join PrePilot (Free)' : 'Password Recovery'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Access your placement readiness profile & streak' 
              : mode === 'register' 
                ? `First 100 registered students receive 100% free lifetime access (${stats.remaining} spots left)`
                : 'Recover your password via instant email or mobile phone OTP'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl mb-4 border border-slate-800">
          <button
            onClick={() => { setMode('login'); setError(null); setNotice(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); setNotice(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'register' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setMode('forgot'); setError(null); setNotice(null); setForgotStep('request_otp'); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'forgot' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{notice}</div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Registered Email or Phone</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu or 9876543210"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setForgotIdentifier(email); setForgotStep('request_otp'); }}
                  className="text-[11px] text-sky-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Mobile Phone (For OTP Recovery)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Password (min 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Target Placement Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
                <option value="Data Analyst / Data Engineer">Data Analyst / Data Engineer</option>
                <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                <option value="Full Stack Web Developer">Full Stack Web Developer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-4"
            >
              <span>Claim Free Early-Bird Spot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD WITH OTP */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {simulatedOtpDisplay && (
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 space-y-1.5 animate-in fade-in">
                <div className="text-[11px] text-slate-300">
                  Simulated OTP for <strong>{otpDestination}</strong>:
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-emerald-400 tracking-widest">
                    {simulatedOtpDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveOtp(simulatedOtpDisplay)}
                    className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            )}

            {forgotStep === 'request_otp' && (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Registered Email or Phone Number</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="student@college.edu or 9876543210"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {forgotStep === 'verify_otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Enter 6-Digit OTP</label>
                    {isTimerRunning ? (
                      <span className="text-[10px] text-slate-400">Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Resend
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={activeOtp}
                    onChange={(e) => setActiveOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.4em] font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={activeOtp.length !== 6}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {forgotStep === 'new_password' && (
              <form onSubmit={handleSetNewPassword} className="space-y-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <span>Update Password & Sign In</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Quick Demo Persona Switcher Banner */}
        <div className="mt-5 pt-3.5 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500 block mb-1.5">Preset Student Personas:</span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                const u = StorageService.switchToPreset('arjun');
                onLoginSuccess(u);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-sky-300 font-medium"
            >
              Arjun (SDE)
            </button>
            <button
              onClick={() => {
                const u = StorageService.switchToPreset('priya');
                onLoginSuccess(u);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-purple-300 font-medium"
            >
              Priya (Data Analyst)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
