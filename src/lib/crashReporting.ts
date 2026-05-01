import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const errorsCollection = collection(db, 'client_errors');

export async function captureClientError(error: unknown, context: string) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  try {
    await addDoc(errorsCollection, {
      context,
      message: normalized.message,
      stack: normalized.stack || '',
      createdAt: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  } catch (loggingError) {
    console.error('Failed to write client error log', loggingError);
  }
}

export function installGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => {
    void captureClientError(event.error ?? event.message, 'window.error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    void captureClientError(event.reason, 'window.unhandledrejection');
  });
}
