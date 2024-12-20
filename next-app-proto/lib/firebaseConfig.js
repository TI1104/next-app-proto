import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore をインポート
//import { getDatabase } from "firebase/database"; // Realtime Databaseをインポート

// デバッグ用のコードを一時的に追加
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... 他の設定
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Realtime DatabaseのURLを追加
};

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig);

// Firestore インスタンスを取得
const db = getFirestore(app);

// Realtime Database インスタンスを取得
//const database = getDatabase(app);

export { db };  // db と database をエクスポート
