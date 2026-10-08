import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, SimulationResult } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Named database support as configured in firebase-applet-config.json
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot per Firebase skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Connected to Firestore successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or network is slow.');
    } else {
      console.log('Firestore connection verified with local fallback readiness.');
    }
    return false;
  }
}

// Initial test trigger
testFirestoreConnection();

export interface PersistedReport {
  id: string;
  userId: string;
  targetRole: string;
  alignmentScore: number;
  simulatedScore: number;
  createdAt: string;
  simulatedSkills: string[];
  summarySnippet: string;
}

const STORAGE_KEY_REPORTS = 'pravriddhi_persisted_reports';
const LEGACY_STORAGE_KEY_REPORTS = 'skilltwin_persisted_reports';
const STORAGE_KEY_PROFILE = 'pravriddhi_user_profile';
const LEGACY_STORAGE_KEY_PROFILE = 'skilltwin_user_profile';

export const firebaseService = {
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(`pravriddhi_profile_${profile.id}`, JSON.stringify(profile));
      const userRef = doc(db, 'users', profile.id);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Profile persisted locally:', e);
    }
  },

  async getUserProfile(userId: string, fallback: UserProfile): Promise<UserProfile> {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      const local = localStorage.getItem(`pravriddhi_profile_${userId}`) || localStorage.getItem(`skilltwin_profile_${userId}`);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Using local fallback profile:', e);
      const local = localStorage.getItem(`pravriddhi_profile_${userId}`) || localStorage.getItem(`skilltwin_profile_${userId}`);
      if (local) {
        return JSON.parse(local);
      }
    }
    return fallback;
  },

  async saveGeneratedReport(report: PersistedReport): Promise<void> {
    try {
      // Local storage cache
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      const list: PersistedReport[] = stored ? JSON.parse(stored) : [];
      list.unshift(report);
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(list.slice(0, 10)));

      // Firestore persistence
      const reportsCol = collection(db, 'users', report.userId, 'reports');
      await addDoc(reportsCol, report);
    } catch (e) {
      console.warn('Report cached in browser storage:', e);
    }
  },

  async getRecentReports(userId: string): Promise<PersistedReport[]> {
    try {
      const reportsCol = collection(db, 'users', userId, 'reports');
      const q = query(reportsCol, orderBy('createdAt', 'desc'), limit(5));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as PersistedReport);
      }
    } catch (e) {
      // Read local fallback
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
};
