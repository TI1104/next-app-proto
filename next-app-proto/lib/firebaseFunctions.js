import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";  // dbをインポート

export class FirebaseController {
  // メッセージの保存
  static async writeMessage(message) {
    try {
      // コレクション「messages」の中の「currentMessage」ドキュメントにデータを保存
      const docRef = doc(db, "messages", "currentMessage"); // doc() を使ってドキュメントを指定
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
}
