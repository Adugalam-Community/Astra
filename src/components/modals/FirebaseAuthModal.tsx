import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Cloud, 
  CloudRain, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  Lock,
  Mail,
  Key,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const FirebaseAuthModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    firebaseUser, 
    firebaseLoading,
    isFirebaseSyncEnabled,
    toggleFirebaseSync,
    loginWithEmailPass,
    registerWithEmailPass,
    logoutFirebaseUser,
    syncLocalToCloud,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);

  if (activeModal !== 'firebaseAuth') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const ok = await registerWithEmailPass(email, password);
        if (ok) {
          showToast('Account registered and logged in to Firebase!');
          setActiveModal(null);
        }
      } else {
        const ok = await loginWithEmailPass(email, password);
        if (ok) {
          showToast('Signed in to Firebase successfully!');
          setActiveModal(null);
        }
      }
    } catch (err: any) {
      const code = err?.code || '';
      let msg = err?.message || 'Authentication failed.';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. If you do not have an account, click "Create Account".';
      } else if (code === 'auth/email-already-in-use') {
        msg = 'This email is already in use. Please switch to "Sign In".';
      } else if (code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console yet. Please enable it under Authentication > Sign-in method.';
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSyncToCloud = async () => {
    setSyncingCloud(true);
    try {
      await syncLocalToCloud();
      showToast('✓ All local leads, products, orders & workflows pushed to Cloud Firestore!');
    } catch (e: any) {
      showToast('⚠️ Cloud sync error: ' + (e?.message || 'Failed'));
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base tracking-tight leading-tight">
                Firebase Cloud Sync
              </h2>
              <p className="text-[11px] text-orange-100 font-mono">
                Project: scaleastra-prod
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Connected User Status Screen */}
          {firebaseUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Authenticated with Firebase</span>
                </div>
                <div className="text-xs text-slate-700 font-mono space-y-1">
                  <div><span className="text-slate-500">Email:</span> {firebaseUser.email}</div>
                  <div><span className="text-slate-500">UID:</span> <span className="text-[10px] truncate max-w-[200px] inline-block align-bottom">{firebaseUser.uid}</span></div>
                </div>
              </div>

              {/* Live Sync Setting */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-orange-600" />
                    <span>Real-Time Firestore Sync</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sync leads, products, orders & invoices across all devices
                  </div>
                </div>

                <button
                  onClick={toggleFirebaseSync}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    isFirebaseSyncEnabled 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isFirebaseSyncEnabled ? 'Enabled' : 'Paused'}
                </button>
              </div>

              {/* Push Local Data to Cloud */}
              <button
                onClick={handleSyncToCloud}
                disabled={syncingCloud}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 font-semibold text-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{syncingCloud ? 'Uploading to Firestore...' : 'Push All Workspace Data to Firestore'}</span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={async () => {
                  await logoutFirebaseUser();
                  showToast('Signed out from Firebase');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Login / Signup Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug">{errorMessage}</div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@scaleastra.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Quick Fill Demo Helper */}
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@purewildhoney.in');
                  setPassword('scaleastra2026');
                }}
                className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <span>⚡ Fill with demo owner email</span>
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                {mode === 'signin' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Signing in...' : 'Sign In with Email'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Registering...' : 'Create Firebase Account'}</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Firebase Setup Tip:</div>
                <p>
                  Ensure "Email/Password" provider is enabled in the Firebase Console under <strong>Authentication &gt; Sign-in method</strong>.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
