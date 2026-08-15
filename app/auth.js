// AARIKA Authentication
// Real Google authentication through Firebase Authentication.
// Authorization is handled separately by AARIKA roles/permissions.

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getAarikaFirebase } from "./firebase.js";

const ALLOWED_DOMAIN = "baljyoti.com";

function assertAllowedUser(user) {
  const email = (user?.email || "").trim().toLowerCase();

  if (!user || !email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    throw new Error("Only authorised @baljyoti.com accounts can access AARIKA.");
  }

  if (user.emailVerified === false) {
    throw new Error("Your Google email could not be verified.");
  }

  return user;
}

export async function signInWithGoogle() {
  const { auth } = getAarikaFirebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);

  try {
    return assertAllowedUser(result.user);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export function observeAuth(callback) {
  const { auth } = getAarikaFirebase();
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  const { auth } = getAarikaFirebase();
  await signOut(auth);
}

export { ALLOWED_DOMAIN };
