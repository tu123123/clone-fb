import { initializeApp } from "firebase/app";
import { getFirestore, query, orderBy, and } from "@firebase/firestore";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
const firebaseConfig = {
  apiKey: "AIzaSyBivl-t7o4tivvuUzjfpGvuxQESTzE63Qo",
  authDomain: "chatapp-e0650.firebaseapp.com",
  databaseURL:
    "https://chatapp-e0650-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-e0650",
  storageBucket: "chatapp-e0650.appspot.com",
  messagingSenderId: "165978143089",
  appId: "1:165978143089:web:2287e26b0787d52c4fded0",
  measurementId: "G-EZN3X0GNR2",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const imgDb = getStorage(app);

const getData2 = async (db: any, action: any, sql?: any) => {
  getDocs(query(collection(firestore, db), sql || null)).then(
    (querySnapshot) => {
      action(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((i: any) => !i.delete)
      );
    }
  );
};
const getData = async (db: any, action: any, sql?: any) => {
  onSnapshot(
    query(
      collection(firestore, db),
      sql || where("time", "!=", ""),
      orderBy("time", "asc")
    ),
    (querySnapshot: any) => {
      action(
        querySnapshot.docs
          .map((doc: any) => ({ ...doc.data(), id: doc.id }))
          .filter((i: any) => !i.delete)
      );
    }
  );
};
const addData = async (db: any, data: any, success: any, err?: any) => {
  try {
    addDoc(collection(firestore, db), {
      ...data,
      time: moment().format("YYYY-MM-DDTHH:mm:ss"),
    }).then(() => success());
  } catch (e) {
    console.error("Error adding document", e);
  }
};
const delData = async (db: any, id: any, success: any) => {
  try {
    await deleteDoc(doc(firestore, db, id)).then(() => success());
  } catch (e) {
    console.error("Error adding document");
  }
};
const upload = async (db: any, id: any, file: any, success: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, "img.png");

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot: any) => {
    console.log("Uploaded a blob or file!");
  });
};
const updateData = async (
  db: any,
  id: any,
  data: any,
  success: any,
  err: any
) => {
  const docRef = doc(firestore, db, id);
  updateDoc(docRef, data)
    .then((docRef: any) => {
      success();
    })
    .catch((error: any) => {
      if (err) err();
      console.log(error);
    });
};
export { firestore, getData, addData, updateData, delData, upload, getData2 };
