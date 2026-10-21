import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Eye, 
  EyeOff, 
  Briefcase,
  ShieldCheck,
  Code2,
  Github,
  Phone,
  KeyRound,
  RotateCcw,
  Check,
  Gift,
  Flame
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onOpenGitHub?: () => void;
  onOpenStartupPlan?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  onLoginSuccess, 
  onOpenGitHub,
  onOpenStartupPlan
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('register');
  
  // Registration Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Development Engineer (SDE)');
  const [college, setCollege] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [dailyHours, setDailyHours] = useState(2);

  // Login Input
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  // States
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const stats = StorageService.getEarlyBirdStats();

  // Timer countdown
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

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

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
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const result = StorageService.loginUser(loginIdentifier || email, loginPassword || password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    } else if (result.user) {
      onLoginSuccess(result.user);
    }
  };

  // Handle OTP Send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

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
    setSuccessNotice(`Verification code sent to ${res.destination}!`);
  };

  // Handle OTP Verification & Step Advance
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = StorageService.verifyOtp(activeOtp);
    if (!res.success) {
      setError(res.error || 'Incorrect OTP code.');
      return;
    }

    setForgotStep('new_password');
    setSuccessNotice('OTP verified successfully! Now choose your new password.');
  };

  // Handle Setting New Password
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

    setSuccessNotice('Password successfully updated! You can now sign in.');
    setTab('login');
    setLoginIdentifier(forgotIdentifier);
    setLoginPassword(newPassword);
    setForgotStep('request_otp');
    setActiveOtp('');
    setSimulatedOtpDisplay(null);
  };

  // Quick Demo Logins
  const handleDemoLogin = (persona: 'arjun' | 'priya') => {
    const user = StorageService.switchToPreset(persona);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950">
      
      {/* Top Banner with Startup Launch Offer & GitHub Button */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 py-3 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Pre<span className="text-sky-400">Pilot</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Placement Preparation & Readiness Platform
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Early-Bird Program Badge */}
            <button
              onClick={onOpenStartupPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
              title="Click to view First 100 Early Bird Startup Free Access Details"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>{stats.claimed}/100 Free Spots</span>
            </button>

            {/* Prominent GitHub Button (Requested by User) */}
            {onOpenGitHub && (
              <button
                onClick={onOpenGitHub}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 shadow-sm transition-all hover:scale-[1.02]"
                title="Push to GitHub (Lakshmeesha03ke)"
              >
                <Github className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Push to GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          {/* Startup Launch Offer Highlight Banner */}
          <div 
            onClick={onOpenStartupPlan}
            className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-amber-500/15 border border-amber-500/30 text-amber-200 cursor-pointer hover:border-amber-400/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Startup Early-Bird Initiative
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                {stats.remaining} Spots Left
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-snug font-medium">
              “Who come first 100 email they will get all resources and my preparation feature will be free. After comes will maintain fee according to what you take like mock interview, AI recommendations, etc.”
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex rounded-2xl bg-slate-950 p-1 mb-6 border border-slate-800/80">
            <button
              onClick={() => { setTab('register'); setError(null); setSuccessNotice(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'register'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register (Free)
            </button>
            <button
              onClick={() => { setTab('login'); setError(null); setSuccessNotice(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('forgot'); setError(null); setSuccessNotice(null); setForgotStep('request_otp'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'forgot'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>{successNotice}</div>
            </div>
          )}

          {/* TAB 1: REGISTRATION */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Lakshmeesh / Student Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mobile Number (For OTP)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Target Placement Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Software Development Engineer (SDE)">Software Engineer (SDE)</option>
                    <option value="Data Analyst / Data Engineer">Data Analyst</option>
                    <option value="Cloud / DevOps Engineer">Cloud / DevOps</option>
                    <option value="Full Stack Web Developer">Full Stack Developer</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Engineering College"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Drive Date (Optional)</label>
                  <input
                    type="date"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Daily Study (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
              >
                <span>Claim Free Spot & Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Registered Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="student@college.edu or 9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => { 
                      setTab('forgot'); 
                      setForgotIdentifier(loginIdentifier); 
                      setError(null); 
                      setForgotStep('request_otp');
                    }}
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
              >
                <span>Sign In to PrePilot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD WITH OTP (EMAIL OR PHONE) */}
          {tab === 'forgot' && (
            <div className="space-y-4 text-xs">
              {/* Stepper Header */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">
                  {forgotStep === 'request_otp' && 'Step 1: Request Verification Code'}
                  {forgotStep === 'verify_otp' && 'Step 2: Enter 6-Digit OTP'}
                  {forgotStep === 'new_password' && 'Step 3: Set New Password'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                  OTP Recovery
                </span>
              </div>

              {/* Simulated OTP Notification Banner (Effortless testing) */}
              {simulatedOtpDisplay && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-indigo-300">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      Simulated SMS / Email Dispatch:
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300 font-mono">
                      Valid 5 mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-indigo-500/30">
                    <span className="text-xs text-slate-300">
                      Code for <strong>{otpDestination}</strong>:
                    </span>
                    <span className="font-mono font-black text-lg tracking-widest text-emerald-400">
                      {simulatedOtpDisplay}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveOtp(simulatedOtpDisplay)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Auto-Fill
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: Enter Email or Phone */}
              {forgotStep === 'request_otp' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">
                      Registered Email or Mobile Number
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="e.g. arjun.sharma@campus.edu or 9876543210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 font-mono transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      We'll send an authentic 6-digit verification code to this address or mobile number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="w-full text-center text-slate-400 hover:text-white pt-1"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}

              {/* STEP 2: Enter & Verify OTP */}
              {forgotStep === 'verify_otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">
                        Enter 6-Digit OTP Code
                      </label>
                      {isTimerRunning ? (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" /> Resend in {otpTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Resend OTP
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={activeOtp.length !== 6}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep('request_otp')}
                    className="w-full text-center text-slate-400 hover:text-white"
                  >
                    Change Email / Number
                  </button>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {forgotStep === 'new_password' && (
                <form onSubmit={handleSetNewPassword} className="space-y-3.5">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                  >
                    <span>Reset Password & Proceed to Login</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Accounts Banner */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-2 font-medium">
              Academic Viva Testing: One-Click Demo Profiles
            </span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleDemoLogin('arjun')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-sky-300 font-semibold transition-colors flex items-center gap-1.5"
                title="Logs in as Arjun (High Aptitude / Low DSA)"
              >
                <span>Arjun (SDE Aspirant)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('priya')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-purple-300 font-semibold transition-colors flex items-center gap-1.5"
                title="Logs in as Priya (Data Analyst)"
              >
                <span>Priya (Data Analyst)</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 z-10 px-4">
        <p>
          PrePilot — Intelligent Placement Preparation & Readiness Platform
        </p>
        <p className="mt-0.5 text-slate-400">
          Developed by <strong className="text-sky-400 font-semibold">Lakshmeesh</strong> • First 100 Early Bird Program Active
        </p>
      </footer>

    </div>
  );
};
