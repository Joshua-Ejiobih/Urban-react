
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBe5UPK_ziFUbZq73J_4Zj59Kig9NTET3M",
    authDomain: "urban-react-35c0e.firebaseapp.com",
    projectId: "urban-react-35c0e",
    storageBucket: "urban-react-35c0e.firebasestorage.app",
    messagingSenderId: "12042158865",
    appId: "1:12042158865:web:10aae1aaac30986a4002b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const firebaseService = {
    async signUp(email, password, fullName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email,
                fullName,
                uid: user.uid
            });
            return user;
        } catch (e) {
            console.error('SignUp Error:', e);
            throw e;
        }
    },
    async getCurrentUserFullName() {
        const user = auth.currentUser;
        if (!user) return '';
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return userDoc.data().fullName || '';
        }
        return '';
    },
    signIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    },
    signOut() {
        return signOut(auth);
    },
    getCurrentUser() {
        return auth.currentUser;
    },
    onAuthStateChanges(callback) {
        return onAuthStateChanged(auth, callback);
    },
};