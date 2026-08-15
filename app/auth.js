// AARIKA Authentication
// Google authentication through Firebase Authentication.
// Uses redirect + browserLocalPersistence for GitHub Pages.

import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getAarikaFirebase } from "./firebase.js";

const ALLOWED_DOMAIN = "baljyoti.com";

function assertAllowedUser(user) {
  const email = (user?.email || "").trim().toLowerCase();

  if (!user || !email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    throw new Error(
      "Only authorised @baljyoti.com accounts can access AARIKA."
    );
  }

  if (user.emailVerified === false) {
    throw new Error("Your Google email could not be verified.");
  }

  return user;
}


// ----------------------------------------------------
// GOOGLE LOGIN
// ----------------------------------------------------

export async function signInWithGoogle() {
  const { auth } = getAarikaFirebase();

  // Keep authentication session in browser storage.
  await setPersistence(auth, browserLocalPersistence);

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
    hd: ALLOWED_DOMAIN
  });

  await signInWithRedirect(auth, provider);
}


// ----------------------------------------------------
// COMPLETE GOOGLE REDIRECT
// ----------------------------------------------------

export async function completeGoogleRedirect() {
  const { auth } = getAarikaFirebase();

  try {
    const result = await getRedirectResult(auth);

    if (!result || !result.user) {
      return null;
    }

    return assertAllowedUser(result.user);

  } catch (error) {

    // If authentication was successful but the account
    // is not authorised, sign the user out.
    if (
      error?.message &&
      error.message.includes("Only authorised")
    ) {
      await signOut(auth);
    }

    throw error;
  }
}


// ----------------------------------------------------
// AUTH STATE
// ----------------------------------------------------

export function observeAuth(callback) {
  const { auth } = getAarikaFirebase();

  return onAuthStateChanged(auth, callback);
}


// ----------------------------------------------------
// LOGOUT
// ----------------------------------------------------

export async function logout() {
  const { auth } = getAarikaFirebase();

  await signOut(auth);
}


// ----------------------------------------------------
// EXPORT
// ----------------------------------------------------

export { ALLOWED_DOMAIN };
