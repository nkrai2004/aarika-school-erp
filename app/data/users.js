// AARIKA user profile service
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAarikaFirebase } from "../firebase.js";

const DEFAULT_ROLE = "VIEWER";

export async function getOrCreateUserProfile(user) {
  if (!user?.uid || !user?.email) throw new Error("Authenticated user is required.");

  const { db } = getAarikaFirebase();
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };

  const profile = {
    uid: user.uid,
    email: user.email.toLowerCase(),
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    roleId: DEFAULT_ROLE,
    schoolId: null,
    status: "PENDING",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(ref, profile);
  return { id: user.uid, ...profile };
}
