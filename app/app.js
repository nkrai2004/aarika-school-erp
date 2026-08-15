// AARIKA application entry point
import { signInWithGoogle, observeAuth, logout } from "./auth.js";
import { getOrCreateUserProfile } from "./data/users.js";
import { isFirebaseConfigured } from "./firebase-config.js";

const loginButton = document.querySelector("#googleLogin");
const logoutButton = document.querySelector("#logoutButton");
const status = document.querySelector("#status");
const userPanel = document.querySelector("#userPanel");

function setStatus(message, error = false) {
  status.textContent = message;
  status.dataset.error = error ? "true" : "false";
}

async function login() {
  if (!isFirebaseConfigured()) {
    setStatus("AARIKA is ready, but Firebase configuration is not connected yet.", true);
    return;
  }

  loginButton.disabled = true;
  setStatus("Opening secure Google sign-in…");

  try {
    const user = await signInWithGoogle();
    const profile = await getOrCreateUserProfile(user);
    userPanel.hidden = false;
    userPanel.textContent = `${profile.displayName || profile.email} • ${profile.status}`;
    loginButton.hidden = true;
    logoutButton.hidden = false;
    setStatus("Signed in successfully.");
  } catch (error) {
    setStatus(error.message || "Unable to sign in.", true);
  } finally {
    loginButton.disabled = false;
  }
}

async function doLogout() {
  await logout();
  userPanel.hidden = true;
  loginButton.hidden = false;
  logoutButton.hidden = true;
  setStatus("You have been signed out.");
}

loginButton?.addEventListener("click", login);
logoutButton?.addEventListener("click", doLogout);

if (!isFirebaseConfigured()) {
  setStatus("Foundation ready — Firebase configuration required for live sign-in.");
}

if (isFirebaseConfigured()) {
  observeAuth(async (user) => {
    if (!user) return;
    try {
      const profile = await getOrCreateUserProfile(user);
      userPanel.hidden = false;
      userPanel.textContent = `${profile.displayName || profile.email} • ${profile.status}`;
      loginButton.hidden = true;
      logoutButton.hidden = false;
    } catch (error) {
      setStatus(error.message || "Unable to load your AARIKA profile.", true);
    }
  });
}
