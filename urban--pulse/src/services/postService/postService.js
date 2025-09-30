
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBe5UPK_ziFUbZq73J_4Zj59Kig9NTET3M",
    authDomain: "urban-react-35c0e.firebaseapp.com",
    projectId: "urban-react-35c0e",
    storageBucket: "urban-react-35c0e.firebasestorage.app",
    messagingSenderId: "12042158865",
    appId: "1:12042158865:web:10aae1aaac30986a4002b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Post object shape is documented here for reference
// {
//   id, author, title, description, category, date, tags, image, location
// }

export const postsService = {
    async getPosts() {
        const postsCol = collection(db, 'posts');
        const snapshot = await getDocs(postsCol);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    async addPost(post) {
        const PostCol = collection(db, 'posts');
        const { id, ...postWithoutId } = post;
        await addDoc(PostCol, postWithoutId);
    },
    async updatePost(post) {
        if (!post.id) return;
        const postRef = doc(db, 'posts', post.id);
        const { id, ...postWithoutId } = post;
        await updateDoc(postRef, postWithoutId);
    },
    async deletePost(id) {
        if (!id) return;
        const postRef = doc(db, 'posts', id);
        await deleteDoc(postRef);
    },
};