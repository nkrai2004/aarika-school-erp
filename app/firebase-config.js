// AARIKA Firebase configuration
// Firebase Web configuration is intentionally kept in a separate module.
// Replace the placeholder values with the Web App configuration from the
// AARIKA Firebase project before enabling production authentication/data.

export const AARIKA_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export function isFirebaseConfigured(config = AARIKA_FIREBASE_CONFIG) {
  return Boolean(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.appId
  );
}
