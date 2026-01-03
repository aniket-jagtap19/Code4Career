import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export const saveUserToFirestore = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New user
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "student",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // Existing user → update last login
    await setDoc(
      userRef,
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  }
};
