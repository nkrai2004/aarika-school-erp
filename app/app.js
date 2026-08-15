// AARIKA application entry point
// Google authentication -> authenticated Director -> dashboard.

import { signInWithGoogle, completeGoogleRedirect, observeAuth, logout } from "./auth.js";
import { isFirebaseConfigured } from "./firebase-config.js";

const loginButton = document.querySelector("#googleLogin");
const logoutButton = document.querySelector("#logoutButton");
const status = document.querySelector("#status");
const userPanel = document.querySelector("#userPanel");
let routing = false;

function setStatus(message, error = false) {
  if (!status) return;
  status.textContent = message;
  status.dataset.error = error ? "true" : "false";
}

function isAuthorised(user) {
  return Boolean(user?.email?.toLowerCase().endsWith("@baljyoti.com"));
}

function showSignedInUser(user) {
  if (userPanel) {
    userPanel.hidden = false;
    userPanel.textContent = `${user.displayName || user.email} • Authenticated`;
  }
  if (loginButton) loginButton.hidden = true;
  if (logoutButton) logoutButton.hidden = false;
}

function dashboardUrl() {
  // Works on GitHub Pages (/aarika-school-erp/app/) and later on aarika.baljyoti.com (/app/).
  return new URL("dashboard.html", window.location.href).href;
}

function goToDashboard(user) {
  if (routing || !isAuthorised(user)) return;
  routing = true;
  showSignedInUser(user);
  setStatus("Authentication successful. Opening AARIKA dashboard…");
  window.location.assign(dashboardUrl());
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
  try { await logout(); }
  finally {
    routing = false;
    if (userPanel) userPanel.hidden = true;
    if (loginButton) { loginButton.hidden = false; loginButton.disabled = false; }
    if (logoutButton) logoutButton.hidden = true;
    setStatus("You have been signed out.");
  }
}

loginButton?.addEventListener("click", login);
logoutButton?.addEventListener("click", doLogout);

async function initialise() {
  if (!isFirebaseConfigured()) {
    setStatus("Foundation ready — Firebase configuration is required for live sign-in.");
    return;
  }

  try {
    const redirectUser = await completeGoogleRedirect();
    if (redirectUser) {
      goToDashboard(redirectUser);
      return;
    }
  } catch (error) {
    setStatus(error.message || "Google sign-in could not be completed.", true);
    if (loginButton) loginButton.disabled = false;
    return;
  }

  observeAuth((user) => {
    if (!user) {
      setStatus("Sign in with your authorised Bal Jyoti Google account.");
      return;
    }
    if (!isAuthorised(user)) {
      setStatus("Only authorised @baljyoti.com accounts can access AARIKA.", true);
      return;
    }
    goToDashboard(user);
  });
}

initialise();
