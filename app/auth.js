// AARIKA Authentication
// Google authentication through Firebase Authentication.
// Uses redirect authentication with explicit browser-local persistence.

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

  const email =
    (user?.email || "")
      .trim()
      .toLowerCase();

  if (
    !user ||
    !email ||
    !email.endsWith(`@${ALLOWED_DOMAIN}`)
  ) {
    throw new Error(
      "Only authorised @baljyoti.com accounts can access AARIKA."
    );
  }

  if (user.emailVerified === false) {
    throw new Error(
      "Your Google email could not be verified."
    );
  }

  return user;
}


/*
 * Google Sign In
 */
export async function signInWithGoogle() {

  const { auth } =
    getAarikaFirebase();

  /*
   * IMPORTANT:
   * Explicitly tell Firebase to keep the
   * authenticated session in this browser.
   */
  await setPersistence(
    auth,
    browserLocalPersistence
  );

  const provider =
    new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
    hd: ALLOWED_DOMAIN
  });

  await signInWithRedirect(
    auth,
    provider
  );
}


/*
 * Complete Google redirect
 */
export async function completeGoogleRedirect() {

  const { auth } =
    getAarikaFirebase();

  /*
   * Restore browser-local persistence
   * before reading the redirect result.
   */
  await setPersistence(
    auth,
    browserLocalPersistence
  );

  const result =
    await getRedirectResult(auth);

  if (!result?.user) {
    return null;
  }

  try {

    return assertAllowedUser(
      result.user
    );

  } catch (error) {

    await signOut(auth);

    throw error;

  }
}


/*
 * Observe authentication state
 */
export function observeAuth(callback) {

  const { auth } =
    getAarikaFirebase();

  return onAuthStateChanged(
    auth,
    callback
  );
}


/*
 * Logout
 */
export async function logout() {

  const { auth } =
    getAarikaFirebase();

  await signOut(auth);
}


export {
  ALLOWED_DOMAIN
};
