import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseAuthProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  ActionCodeSettings,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { AuthUser, UserProfile } from '../types';
import { auth, firebaseService } from './firebaseService';
import { resumeStorageService } from './resumeStorageService';

const STORAGE_KEY_AUTH = 'pravriddhi_auth_user';
const LEGACY_STORAGE_KEY_AUTH = 'skilltwin_auth_user';

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Array<(user: AuthUser | null) => void> = [];
  private authInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    // 1. First restore from local storage cache for instant UI rendering
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH) || localStorage.getItem(LEGACY_STORAGE_KEY_AUTH);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }

    // 2. Attach live Firebase Auth listener
    try {
      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        this.authInitialized = true;
        if (fbUser) {
          const authUser: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Pravriddhi User'),
            photoURL: fbUser.photoURL || undefined,
            provider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'password',
            createdAt: fbUser.metadata.creationTime || new Date().toISOString()
          };
          this.currentUser = authUser;
          this.notify();
        } else {
          // If no active Firebase user, check if we had a guest or simulated session
          if (this.currentUser && this.currentUser.provider !== 'guest') {
            this.currentUser = null;
            this.notify();
          }
        }
      });
    } catch (e) {
      console.warn('Firebase Auth state listener initialized with local fallback:', e);
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public subscribe(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    if (this.currentUser) {
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
      } catch {}
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      } catch {}
    }
    this.listeners.forEach((cb) => cb(this.currentUser));
  }

  /**
   * Real Google Authentication with popup and graceful fallback for sandboxed environments
   */
  public async signInWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Pravriddhi User',
        photoURL: fbUser.photoURL || undefined,
        provider: 'google',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString()
      };

      this.currentUser = authUser;
      this.notify();
      return authUser;
    } catch (firebaseErr: any) {
      console.warn('Firebase Google Auth popup encountered restriction, evaluating resolution:', firebaseErr);
      
      // If popup blocked or forbidden in iframe environment, allow clean login
      if (
        firebaseErr.code === 'auth/popup-blocked' ||
        firebaseErr.code === 'auth/popup-closed-by-user' ||
        firebaseErr.code === 'auth/cancelled-popup-request' ||
        firebaseErr.code === 'auth/operation-not-supported-in-this-environment' ||
        firebaseErr.message?.includes('iframe')
      ) {
        throw new Error('Google Sign-In popup was prevented by browser or environment. Please sign in with your email and password below.');
      }

      throw new Error(firebaseErr.message || 'Google Sign-In failed');
    }
  }

  /**
   * Real Firebase Email & Password Sign In
   */
  public async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = cred.user;
      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || email.split('@')[0],
        photoURL: fbUser.photoURL || undefined,
        provider: 'password',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString()
      };
      this.currentUser = authUser;
      this.notify();
      return authUser;
    } catch (err: any) {
      const message = this.mapAuthErrorMessage(err.code || err.message);
      throw new Error(message);
    }
  }

  /**
   * Real Firebase Email & Password Registration
   */
  public async signUpWithEmail(name: string, email: string, password: string): Promise<AuthUser> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = cred.user;

      if (name.trim()) {
        try {
          await updateFirebaseAuthProfile(fbUser, { displayName: name.trim() });
        } catch (e) {
          console.warn('Could not update display name in Firebase:', e);
        }
      }

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: name.trim() || email.split('@')[0],
        photoURL: undefined,
        provider: 'password',
        createdAt: new Date().toISOString()
      };

      this.currentUser = authUser;
      this.notify();
      return authUser;
    } catch (err: any) {
      const message = this.mapAuthErrorMessage(err.code || err.message);
      throw new Error(message);
    }
  }

  /**
   * Real Firebase Password Reset Email with explicit continueUrl and handleCodeInApp
   */
  public async sendPasswordReset(email: string): Promise<boolean> {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const continueUrl = `${origin}/?mode=resetPassword`;

      const actionCodeSettings: ActionCodeSettings = {
        url: continueUrl,
        handleCodeInApp: false
      };

      try {
        await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      } catch (settingsErr: any) {
        // Fallback without actionCodeSettings if domain is restricted
        if (settingsErr.code?.includes('unauthorized-domain') || settingsErr.code?.includes('invalid-continue-uri')) {
          await sendPasswordResetEmail(auth, email.trim());
        } else {
          throw settingsErr;
        }
      }
      return true;
    } catch (err: any) {
      const message = this.mapAuthErrorMessage(err.code || err.message);
      throw new Error(message);
    }
  }

  /**
   * Validates Firebase Out-Of-Band (oobCode) password reset code.
   * Returns the email address associated with the password reset request.
   */
  public async verifyResetCode(oobCode: string): Promise<string> {
    try {
      const email = await verifyPasswordResetCode(auth, oobCode.trim());
      return email;
    } catch (err: any) {
      const message = this.mapAuthErrorMessage(err.code || err.message);
      throw new Error(message);
    }
  }

  /**
   * Confirms password reset in Firebase using verified oobCode and new password.
   */
  public async confirmResetPassword(oobCode: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(auth, oobCode.trim(), newPassword);
    } catch (err: any) {
      const message = this.mapAuthErrorMessage(err.code || err.message);
      throw new Error(message);
    }
  }

  /**
   * Quick Demo Account switch for testing without registration
   */
  public async signInAsDemo(role: 'candidate' | 'engineer'): Promise<AuthUser> {
    const demoUser: AuthUser = {
      uid: role === 'candidate' ? 'pravriddhi_demo_candidate' : 'pravriddhi_demo_engineer',
      email: role === 'candidate' ? 'candidate.demo@pravriddhi.ai' : 'engineer.demo@pravriddhi.ai',
      displayName: role === 'candidate' ? 'Demo Candidate' : 'Senior Systems Engineer',
      provider: 'password',
      createdAt: new Date().toISOString()
    };
    this.currentUser = demoUser;
    this.notify();
    return demoUser;
  }

  /**
   * Guest account creation
   */
  public createGuestSession(): AuthUser {
    const guestUser: AuthUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: '',
      displayName: 'Guest User',
      provider: 'guest',
      createdAt: new Date().toISOString()
    };
    this.currentUser = guestUser;
    this.notify();
    return guestUser;
  }

  /**
   * Sign Out: Cleans Firebase session and local session
   */
  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    this.currentUser = null;
    this.notify();
  }

  /**
   * Creates a blank user profile tailored for a specific authenticated user
   */
  public createEmptyProfileForUser(user: AuthUser): UserProfile {
    return {
      id: user.uid,
      name: user.displayName || (user.email ? user.email.split('@')[0] : 'CareerTwin User'),
      title: '',
      location: '',
      targetRole: 'CareerTwin Explorer',
      targetRoleAlignment: 0,
      alignmentTrend: 0,
      summary: '',
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      education: [],
      hasUploadedResume: false,
      uploadedResumeName: '',
      activeResumeId: '',
      isDemoMode: false,
      onboardingCompleted: false
    };
  }

  /**
   * Persistence for user profile
   */
  public saveProfileToDatabase(profile: UserProfile): void {
    if (!profile || !profile.id) return;
    try {
      localStorage.setItem(`pravriddhi_profile_${profile.id}`, JSON.stringify(profile));
    } catch {}
    firebaseService.saveUserProfile(profile);
  }

  public loadProfileFromDatabase(userIdOrFallback: string | UserProfile, fallback?: UserProfile): UserProfile {
    try {
      const id = typeof userIdOrFallback === 'string' ? userIdOrFallback : userIdOrFallback.id;
      const defaultProfile = typeof userIdOrFallback === 'object' ? userIdOrFallback : fallback!;

      // 1. Try Pravriddhi storage key
      const stored = localStorage.getItem(`pravriddhi_profile_${id}`);
      if (stored) {
        return JSON.parse(stored);
      }

      // 2. Try legacy storage key
      const legacy = localStorage.getItem(`skilltwin_profile_${id}`);
      if (legacy) {
        return JSON.parse(legacy);
      }

      // 3. Check if user has an active resume stored
      const activeResume = resumeStorageService.getActiveResumeRecord(id);
      if (activeResume) {
        return resumeStorageService.createProfileFromResumeRecord(activeResume);
      }

      return defaultProfile;
    } catch {
      return typeof userIdOrFallback === 'object' ? userIdOrFallback : fallback!;
    }
  }

  private mapAuthErrorMessage(codeOrMsg: string): string {
    if (!codeOrMsg) return 'Authentication failed. Please verify credentials.';
    if (codeOrMsg.includes('auth/invalid-email')) return 'Please enter a valid email address.';
    if (codeOrMsg.includes('auth/user-not-found')) return 'No account found with this email. Please sign up.';
    if (codeOrMsg.includes('auth/wrong-password')) return 'Incorrect password. Please try again or reset password.';
    if (codeOrMsg.includes('auth/invalid-credential')) return 'Invalid login credentials. Please check your email and password.';
    if (codeOrMsg.includes('auth/email-already-in-use')) return 'An account with this email already exists. Please sign in.';
    if (codeOrMsg.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
    if (codeOrMsg.includes('auth/too-many-requests') || codeOrMsg.includes('RESET_PASSWORD_EXCEED_LIMIT')) {
      return 'Password reset limit reached. Please wait a few minutes before trying again, or check your spam folder for the email already sent.';
    }
    if (codeOrMsg.includes('auth/expired-action-code')) return 'This password reset link has expired. Please request a new recovery link.';
    if (codeOrMsg.includes('auth/invalid-action-code')) return 'This password reset link is invalid or has already been used. Please request a new recovery link.';
    if (codeOrMsg.includes('auth/operation-not-allowed')) return 'Email/Password sign-in provider is not enabled in Firebase Console. Please enable Email/Password in Firebase Authentication settings.';
    if (codeOrMsg.includes('auth/user-disabled')) return 'This account has been disabled. Please contact support.';
    return codeOrMsg;
  }
}

export const authService = new AuthService();
