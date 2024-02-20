import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// ajout

try {
    const docRef = await addDoc(collection(db, "tests"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

// lecture

const querySnapshot = await getDocs(collection(db, "tests"));
querySnapshot.forEach((doc) => {
    const userRaw = doc.data();
    let user = {
        first: userRaw.first,
        last: userRaw.last,
        born: userRaw.born,
    };
    console.log(user);
});
