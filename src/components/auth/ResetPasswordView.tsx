/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { authService } from '../../services/firebaseAuth';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ResetPasswordViewProps {
  mode?: string | null;
  oobCode?: string | null;
  apiKey?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
  onRequestNewLink: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  mode,
  oobCode,
  apiKey,
  onSuccess,
  onCancel,
  onRequestNewLink
}) => {
  const [currentCode, setCurrentCode] = useState<string>(oobCode || '');
  const [manualInput, setManualInput] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(!oobCode);
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'submitting' | 'success'>('validating');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(4);

  // Sync currentCode when prop changes
  useEffect(() => {
    if (oobCode) {
      setCurrentCode(oobCode);
    }
  }, [oobCode]);

  // Validate mode, apiKey, and currentCode
  useEffect(() => {
    let isMounted = true;

    async function validateCode() {
      // 1. Verify page mode
      if (mode && mode.toLowerCase() !== 'resetpassword') {
        setStatus('invalid');
        setErrorMessage(
          `The selected page mode "${mode}" is invalid or unsupported. Pravriddhi password recovery requires mode=resetPassword.`
        );
        return;
      }

      // 2. Verify code presence
      if (!currentCode || !currentCode.trim()) {
        setStatus('invalid');
        setErrorMessage('No password recovery token (oobCode) was found in the link. Please request a new password reset email or paste your recovery link/code below.');
        setShowManualEntry(true);
        return;
      }

      // 3. Verify apiKey if provided
      if (apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('AIzaSy')) {
        setStatus('invalid');
        setErrorMessage('The authentication API key provided in the reset link is invalid.');
        return;
      }

      setStatus('validating');
      setErrorMessage('');

      try {
        const email = await authService.verifyResetCode(currentCode);
        if (isMounted) {
          setVerifiedEmail(email);
          setStatus('valid');
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('invalid');
          setErrorMessage(err.message || 'This password reset link is invalid, expired, or has already been used.');
        }
      }
    }

    validateCode();

    return () => {
      isMounted = false;
    };
  }, [mode, currentCode, apiKey]);

  // Handle parsing pasted link or manual code
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let code = manualInput.trim();
    if (!code) return;

    // Check if the user pasted a full URL
    if (code.includes('oobCode=')) {
      try {
        const urlObj = new URL(code.startsWith('http') ? code : `https://${code}`);
        const parsed = urlObj.searchParams.get('oobCode');
        if (parsed) code = parsed;
      } catch {
        const match = code.match(/oobCode=([^&]+)/);
        if (match) code = decodeURIComponent(match[1]);
      }
    }

    setCurrentCode(code);
  };

  // Handle countdown on success
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'success') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      } else {
        onSuccess();
      }
    }
    return () => clearTimeout(timer);
  }, [status, countdown, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!currentCode) {
      setErrorMessage('No recovery token is present to complete this reset.');
      return;
    }

    setStatus('submitting');

    try {
      await authService.confirmResetPassword(currentCode, newPassword);
      setStatus('success');
      // Remove sensitive oobCode from browser history
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err: any) {
      setStatus('valid');
      setErrorMessage(err.message || 'Failed to update password. The link may have expired.');
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl border border-white/80 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pravriddhi Credential Recovery</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {status === 'success' ? 'Password Reset Complete' : 'Reset Your Password'}
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            {status === 'validating' && 'Verifying recovery credentials with Firebase Authentication...'}
            {status === 'valid' && (
              verifiedEmail
                ? `Enter a new password for ${verifiedEmail}`
                : 'Choose a strong password to secure your account and isolated CareerTwin.'
            )}
            {status === 'submitting' && 'Encrypting and updating your password with Firebase...'}
            {status === 'invalid' && 'The recovery link cannot be used.'}
            {status === 'success' && 'Your password has been securely updated. You can now access your account.'}
          </p>
        </div>

        {/* STATE 1: VALIDATING OOB CODE */}
        {status === 'validating' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-800 block">Validating Security Token</span>
              <span className="text-xs text-slate-500">Checking Firebase Out-Of-Band authentication code...</span>
            </div>
          </div>
        )}

        {/* STATE 2: INVALID / EXPIRED LINK */}
        {status === 'invalid' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Unable to Proceed</span>
              </div>
              <p className="leading-relaxed text-rose-700">
                {errorMessage}
              </p>
              <div className="pt-2 text-[11px] text-rose-600 border-t border-rose-200/60">
                Password recovery links can only be used once and expire shortly after being sent for security.
              </div>
            </div>

            {/* Optional Manual Recovery Token / Link Paste */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center w-full gap-1"
              >
                <span>{showManualEntry ? 'Hide manual code entry' : 'Have a recovery link or code from your email? Enter it here'}</span>
              </button>

              {showManualEntry && (
                <form onSubmit={handleManualCodeSubmit} className="mt-3 space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Paste your Firebase email link or oobCode"
                      className="w-full pl-3 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!manualInput.trim()}
                      className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    You can paste either the full URL from your reset email or just the code parameter.
                  </p>
                </form>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onRequestNewLink}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Request a New Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: FORM ENTRY (VALID / SUBMITTING) */}
        {(status === 'valid' || status === 'submitting') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Verified Email Banner */}
            {verifiedEmail && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Account:</span>
                <span className="font-semibold text-slate-800 truncate ml-2">{verifiedEmail}</span>
              </div>
            )}

            {/* Error Message Notice */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* New Password Input */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={status === 'submitting'}
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 bg-white"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Passwords match</span>
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Does not match
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === 'submitting'}
                  className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-xl focus:outline-hidden bg-white ${
                    passwordsMismatch
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-slate-200 focus:border-indigo-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={status === 'submitting' || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </span>
                ) : (
                  <>
                    <span>Confirm & Update Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={status === 'submitting'}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* STATE 4: SUCCESS */}
        {status === 'success' && (
          <div className="space-y-5 text-center py-2 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900">
                Password Successfully Updated
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your credentials have been securely refreshed in Firebase. You can now use your new password to sign in.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Redirecting to Sign In in {countdown}s...</span>
            </div>

            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
