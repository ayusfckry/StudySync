import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocFromServer } from 'firebase/firestore';

import firebaseConfigImport from './firebase-applet-config.json';

// Default mock config to prevent crashes before setup
const defaultFirebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "study-sync-mock.firebaseapp.com",
  projectId: "study-sync-mock",
  storageBucket: "study-sync-mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let firebaseConfig: any = defaultFirebaseConfig;

// Attempt to load real config if it exists
if (firebaseConfigImport && firebaseConfigImport.apiKey !== "TODO_KEYHERE") {
  firebaseConfig = firebaseConfigImport;
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Firestore CRUD Helpers

export const getUserProfile = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getTasks = (uid: string, callback: (tasks: any[]) => void) => {
  const path = 'tasks';
  const q = query(collection(db, 'tasks'), where('uid', '==', uid));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const addTask = async (task: any) => {
  const path = 'tasks';
  try {
    await addDoc(collection(db, 'tasks'), { ...task, uid: auth.currentUser?.uid });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateTask = async (taskId: string, data: any) => {
  const path = `tasks/${taskId}`;
  try {
    const docRef = doc(db, 'tasks', taskId);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteTask = async (taskId: string) => {
  const path = `tasks/${taskId}`;
  try {
    const docRef = doc(db, 'tasks', taskId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const addSession = async (session: any) => {
  const path = 'sessions';
  try {
    await addDoc(collection(db, 'sessions'), { ...session, uid: auth.currentUser?.uid });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getAllUsers = (callback: (users: any[]) => void) => {
  const path = 'users';
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
