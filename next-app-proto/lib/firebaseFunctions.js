import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";  // dbをインポート

export class FirebaseController {
  // メッセージの保存
  static async writeMessage(message) {
    try {
      // コレクション「messages」の中の「currentMessage」ドキュメントにデータを保存
      const docRef = doc(db, "messages", "currentMessage");
      await setDoc(docRef, { 
        text: message,
        timestamp: new Date().toISOString()
      });
      console.log("Firestoreにメッセージが保存されました:", message);
      return true;
    } catch (error) {
      console.error("Firestoreへのメッセージ保存に失敗:", error);
      return false;
    }
  }

  // Firestoreからメッセージを取得
  static async readMessage() {
    try {
      // コレクション「messages」の中の「currentMessage」ドキュメントを取得
      const docRef = doc(db, "messages", "currentMessage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Firestoreから取得したメッセージ:", data.text);
        return data.text; // 保存されたメッセージを返す
      } else {
        console.warn("Firestore: ドキュメントが存在しません");
        return null;
      }
    } catch (error) {
      console.error("Firestoreからのメッセージ取得に失敗:", error);
      return null;
    }
  }
}
