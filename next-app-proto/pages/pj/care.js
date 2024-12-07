import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // Firestoreのリアルタイム取得
import { db } from "../../lib/firebaseConfig";
import styles from "../../styles/Home.module.css";

export default function Geofence() {
  const [message, setMessage] = useState("");
  const [inGeofence, setInGeofence] = useState(false);

  const targetLatitude = 36.703437;
  const targetLongitude = 137.101312;
  const targetRadius = 2;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Firestoreからリアルタイムでメッセージを取得
  useEffect(() => {
    const docRef = doc(db, "messages", "currentMessage"); // Firestoreのドキュメントパス
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.text) {
          setMessage(data.text);
          console.log("Firestoreメッセージ:", data.text);
        }
      } else {
        console.warn("ドキュメントが存在しません");
      }
    });

    return () => unsubscribe(); // クリーンアップ時に購読解除
  }, []);

  // ジオフェンスの監視
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(
            latitude,
            longitude,
            targetLatitude,
            targetLongitude
          );

          console.log(`現在の距離: ${distance.toFixed(2)}km`);

          const isInRange = distance <= targetRadius;

          if (isInRange && !inGeofence) {
            setInGeofence(true);
            console.log("ジオフェンス内");
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          } else if (!isInRange && inGeofence) {
            setInGeofence(false);
            setMessage(""); // ジオフェンス外ではメッセージをクリア
            console.log("ジオフェンス外");
          }
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      console.error("このブラウザはGeolocation APIをサポートしていません。");
    }
  }, [inGeofence]);

  return (
    <div className={styles.container}>
      {message ? (
        <div className={styles.messageContainer}>
          <p className={styles.message}>{message}</p>
        </div>
      ) : (
        <div className={styles.imageContainer}>
          <img
            src="/coco.jpg"
            alt="Coco"
            className={styles.image}
          />
        </div>
      )}
    </div>
  );
}
