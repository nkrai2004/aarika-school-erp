// AARIKA application entry point
// Authentication is handled by Firebase. Once an authorised user is
// authenticated, this entry point immediately routes to the dashboard.

import { signInWithGoogle, observeAuth, logout } from "./auth.js";
import { isFirebaseConfigured } from "./firebase-config.js";

const loginButton = document.querySelector("#googleLogin");
const logoutButton = document.querySelector("#logoutButton");
const status = document.querySelector("#status");
const userPanel = document.querySelector("#userPanel");

function setStatus(message, error = false) {
  if (!status) return;
  status.textContent = message;
  status.dataset.error = error ? "true" : "false";
}

function showSignedInUser(user) {
  if (userPanel) {
    userPanel.hidden = false;
    userPanel.textContent = `${user.displayName || user.email} • Authenticated`;
  }
  if (loginButton) loginButton.hidden = true;
  if (logoutButton) logoutButton.hidden = false;
}

function goToDashboard() {
  window.location.replace(new URL("./dashboard.html", window.location.href).href);
}

async function login() {
  if (!isFirebaseConfigured()) {
    setStatus("AARIKA is ready, but Firebase configuration is not connected yet.", true);
    return;
  }

  if (loginButton) loginButton.disabled = true;
  setStatus("Redirecting to secure Google sign-in…");

  try {
    await signInWithGoogle();
  } catch (error) {
    setStatus(error.message || "Unable to sign in.", true);
    if (loginButton) loginButton.disabled = false;
  }
}

async function doLogout() {
  try {
    await logout();
  } finally {
    if (userPanel) userPanel.hidden = true;
    if (loginButton) loginButton.hidden = false;
    if (logoutButton) logoutButton.hidden = true;
    setStatus("You have been signed out.");
  }
}

loginButton?.addEventListener("click", login);
logoutButton?.addEventListener("click", doLogout);

if (!isFirebaseConfigured()) {
  setStatus("Foundation ready — Firebase configuration is required for live sign-in.");
} else {
  // Firebase restores the authenticated session after Google redirect.
  // Routing does NOT wait for Firestore. Dashboard loads profile data itself.
  observeAuth((user) => {
    if (!user) return;

    const email = (user.email || "").trim().toLowerCase();
    if (!email.endsWith("@baljyoti.com")) return;

    showSignedInUser(user);
    setStatus("Authentication successful. Opening AARIKA dashboard…");
    goToDashboard();
  });
}
