import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, signOut,
  updatePassword, reauthenticateWithCredential,
  EmailAuthProvider, onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDt1jCDKy20wbLXNOTwq0Dk7zZWxkFPPuk",
  authDomain: "info-nitc.firebaseapp.com",
  projectId: "info-nitc",
  storageBucket: "info-nitc.firebasestorage.app",
  messagingSenderId: "434030092358",
  appId: "1:434030092358:web:cdf108df9f763c0f00ea47",
  measurementId: "G-G2T3NR0SSH",
};

const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginAdmin   = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
export const logoutAdmin  = ()          => signOut(auth);
export const onAuthChanged = (cb)       => onAuthStateChanged(auth, cb);
export const changeAdminPassword = async (current, next) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  const cred = EmailAuthProvider.credential(user.email, current);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, next);
};

// ── Firestore ─────────────────────────────────────────────────────────────────
export async function loadData(defaultData) {
  try {
    const ref  = doc(db, "sitedata", "main");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = { ...defaultData, ...snap.data() };
      try { localStorage.setItem("nitc_offline_data", JSON.stringify(d)); } catch {}
      return d;
    }
    await setDoc(ref, defaultData);
    return defaultData;
  } catch (err) {
    console.error("Firebase load error:", err);
    try {
      const cached = localStorage.getItem("nitc_offline_data");
      if (cached) {
        console.log("Loading from offline cache");
        return JSON.parse(cached);
      }
    } catch {}
    return defaultData;
  }
}

export async function saveData(data) {
  try {
    await setDoc(doc(db, "sitedata", "main"), data);
    try { localStorage.setItem("nitc_offline_data", JSON.stringify(data)); } catch {}
    return true;
  } catch (err) {
    console.error("Firebase save error:", err);
    return false;
  }
}

export async function loadSecrets() {
  try {
    const snap = await getDoc(doc(db, "sitedata", "secrets"));
    return snap.exists() ? snap.data() : {};
  } catch { return {}; }
}

export async function saveSecrets(secrets) {
  try {
    await setDoc(doc(db, "sitedata", "secrets"), secrets);
    return true;
  } catch { return false; }
}
export async function loadLostFound() {
  try {
    const snap = await getDoc(doc(db, "sitedata", "lostfound"));
    return snap.exists() ? snap.data() : { lostItems: [], foundItems: [] };
  } catch {
    return { lostItems: [], foundItems: [] };
  }
}

export async function saveLostFound(lostFoundData) {
  try {
    await setDoc(doc(db, "sitedata", "lostfound"), lostFoundData);
    return true;
  } catch (err) {
    console.error("Lost & Found save error:", err);
    return false;
  }
}

// ── Cloudinary: image upload (replaces Firebase Storage) ──────────────────────
const CLOUDINARY_CLOUD_NAME  = "dayr2kxkg";
const CLOUDINARY_UPLOAD_PRESET = "nitc_uploads";
const CLOUDINARY_UPLOAD_URL  = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function uploadMenuImage(file, businessId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("public_id", `${businessId}_${Date.now()}`);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Cloudinary upload failed: " + err);
  }

  const data = await res.json();
  return data.secure_url; // the public HTTPS URL of the uploaded image
}

export async function deleteMenuImage(url) {
  // Cloudinary deletion requires server-side signed requests (API secret),
  // which we intentionally do not expose in client code for security.
  // Images can be deleted manually from the Cloudinary Media Library if needed.
  // This function is kept as a no-op so existing calls don't break.
  console.log("Image removed from app — Cloudinary asset retained:", url);
}
