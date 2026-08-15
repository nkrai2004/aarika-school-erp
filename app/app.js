// AARIKA application entry point
import { signInWithGoogle, observeAuth, logout } from "./auth.js";
import { getOrCreateUserProfile } from "./data/user-profile.js";
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

function showProfile(profile) {
  if (userPanel) {
    userPanel.hidden = false;
    userPanel.textContent = `${profile.displayName || profile.email} • ${profile.status}`;
  }
  if (loginButton) loginButton.hidden = true;
  if (logoutButton) logoutButton.hidden = false;
}

async function login() {
  if (!isFirebaseConfigured()) {
    setStatus("AARIKA is ready, but Firebase configuration is not connected yet.", true);
    return;
  }

  if (loginButton) loginButton.disabled = true;
  setStatus("Redirecting to secure Google sign-in…");

  try {
    // signInWithGoogle uses a full-page redirect. The browser leaves this page,
    // completes Google authentication, and returns to the AARIKA login page.
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
  observeAuth(async (user) => {
    if (!user) return;

    try {
      const profile = await getOrCreateUserProfile(user);
      showProfile(profile);
      setStatus("Authenticated with Google. Opening AARIKA dashboard…");

      // The dashboard owns the authenticated application shell.
      window.location.replace("./dashboard.html");
    } catch (error) {
      setStatus(error.message || "Unable to load your AARIKA profile.", true);
    }
  });
}
