import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import type { User, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { identifyUser, trackEvent } from '../lib/analytics';
import { getUserProfile, getUserProfileByEmail, upsertUserProfile } from '../services/firestoreService';

function isFirestorePermissionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeCode = (error as { code?: unknown }).code;
  return (
    maybeCode === 'permission-denied' ||
    maybeCode === 'firestore/permission-denied'
  );
}

function dedupeRoles(roles: UserRole[]): UserRole[] {
  return Array.from(new Set(roles));
}

function normalizeUserProfile(user: User): User {
  const inferredRoles =
    user.roles && user.roles.length > 0
      ? user.roles
      : user.role === 'seller'
        ? ['buyer', 'seller']
        : [user.role];
  const normalizedRoles = dedupeRoles(inferredRoles);
  const normalizedActiveRole = normalizedRoles.includes(user.lastActiveRole as UserRole)
    ? (user.lastActiveRole as UserRole)
    : normalizedRoles[0];
  return {
    ...user,
    roles: normalizedRoles,
    role: normalizedActiveRole,
    lastActiveRole: normalizedActiveRole,
  };
}

async function resolveUserProfile(uid: string, email: string): Promise<User | null> {
  const directProfile = await getUserProfile(uid);
  if (directProfile) return directProfile;

  const legacyProfile = await getUserProfileByEmail(email);
  if (!legacyProfile) return null;

  const migratedProfile: User = {
    ...legacyProfile,
    id: uid,
    email,
  };
  await upsertUserProfile(migratedProfile);
  return migratedProfile;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  initializeAuth: () => void;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,

      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
            return;
          }
          try {
            await firebaseUser.getIdToken();
            const profile = await resolveUserProfile(firebaseUser.uid, firebaseUser.email || '');
            if (!profile) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                authError:
                  'Account profile not found in Firestore. Please contact support or complete registration again.',
              });
              return;
            }
            const normalizedProfile = normalizeUserProfile(profile);
            set({ user: normalizedProfile, isAuthenticated: true, isLoading: false, authError: null });
            if (
              normalizedProfile.roles?.length !== profile.roles?.length ||
              normalizedProfile.role !== profile.role ||
              normalizedProfile.lastActiveRole !== profile.lastActiveRole
            ) {
              await upsertUserProfile(normalizedProfile);
            }
            void identifyUser(normalizedProfile.id, normalizedProfile.role);
          } catch (error) {
            if (isFirestorePermissionError(error)) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                authError:
                  'Unable to read profile due to Firestore permissions. Please fix rules and try again.',
              });
              return;
            }
            const message =
              error instanceof Error ? error.message : 'Failed to sync account profile from Firestore.';
            set({ user: null, isAuthenticated: false, isLoading: false, authError: message });
          }
        });
      },

      login: async (email: string, password: string, role: UserRole) => {
        set({ isLoading: true, authError: null });
        try {
          const credentials = await signInWithEmailAndPassword(auth, email, password);
          await credentials.user.getIdToken(true);
          const profile = await resolveUserProfile(credentials.user.uid, email);
          if (!profile) {
            throw new Error(
              'Account profile not found in Firestore. Please contact support or complete registration again.'
            );
          }
          const normalizedProfile = normalizeUserProfile(profile);
          if (!normalizedProfile.roles?.includes(role)) {
            throw new Error(
              `This account is not registered as ${role}. Registered roles: ${normalizedProfile.roles?.join(', ')}.`
            );
          }
          const finalUser: User = {
            ...normalizedProfile,
            email: normalizedProfile.email || credentials.user.email || email,
            role,
            lastActiveRole: role,
            isVerified: credentials.user.emailVerified,
          };
          await upsertUserProfile(finalUser);
          await identifyUser(finalUser.id, finalUser.role);
          await trackEvent('login', { role: finalUser.role });
          set({
            user: finalUser,
            isAuthenticated: true,
            authError: null,
          });
          return finalUser;
        } catch (error) {
          if (isFirestorePermissionError(error)) {
            const message =
              'Unable to read profile due to Firestore permissions. Please fix rules and try again.';
            set({ user: null, isAuthenticated: false, authError: message });
            throw new Error(message);
          }
          const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
          set({ user: null, isAuthenticated: false, authError: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true, authError: null });
        try {
          const credentials = await createUserWithEmailAndPassword(auth, email, password);
          await credentials.user.getIdToken(true);
          let profileSyncBlocked = false;

          const newUser: User = {
            id: credentials.user.uid,
            name,
            email,
            role,
            roles: role === 'seller' ? ['buyer', 'seller'] : [role],
            lastActiveRole: role,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            phone: '',
            joinedAt: new Date().toISOString(),
            isVerified: false,
          };

          try {
            await upsertUserProfile(newUser);
          } catch (error) {
            if (!isFirestorePermissionError(error)) throw error;
            profileSyncBlocked = true;
          }
          await identifyUser(newUser.id, newUser.role);
          await trackEvent('sign_up', { role: newUser.role });
          set({
            user: newUser,
            isAuthenticated: true,
            authError: profileSyncBlocked
              ? 'Account created, but profile sync is blocked by Firestore permissions.'
              : null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
          set({ authError: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await signOut(auth);
        await trackEvent('logout');
        set({ user: null, isAuthenticated: false, authError: null });
      },
    }),
    {
      name: 'bazaarpk-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
