import { useState, useEffect } from "react";
import { useMessage } from "../../context/MessageContext"; // useMessage をインポート
import { ref, onValue } from "firebase/database"; // Firebase Realtime Database の関数
import { database } from "../../lib/firebaseConfig"; // Firebase Config のインポート
import styles from "../../styles/Home.module.css";

export default function Geofence() {
  const { message: dynamicMessage } = useMessage(); // useMessage を使って dynamicMessage を取得
  const [message, setMessage] = useState(""); // Firebaseからのメッセージを管理
  const [inGeofence, setInGeofence] = useState(false); // ジオフェンスの状態を管理

  // ターゲット地点と半径
  const targetLatitude = 36.703437; // ターゲット地点の緯度
  const targetLongitude = 137.101312; // ターゲット地点の経度
  const targetRadius = 1.0; // 半径（km）

  // 距離計算関数
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球の半径（km）
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 距離 (km)
  };

  // Firebaseからメッセージを監視
  useEffect(() => {
    const messageRef = ref(database, "messages/current"); // Realtime Database のパス

    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.text) {
        setMessage(data.text); // Firebaseからのメッセージを状態にセット
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  // ジオフェンス監視
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // 距離を計算
          const distance = calculateDistance(
            latitude,
            longitude,
            targetLatitude,
            targetLongitude
          );

          console.log(`現在の距離: ${distance.toFixed(2)}km`);

          const isInRange = distance <= targetRadius;

          // ジオフェンス内外の状態を更新
          if (isInRange && !inGeofence) {
            setInGeofence(true);

            // Firebaseからのメッセージを更新
            setMessage(dynamicMessage); // 取得した動的メッセージを表示

            // バイブレーションで通知
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          } else if (!isInRange && inGeofence) {
            setInGeofence(false);
            setMessage(""); // エリア外に出た場合、メッセージをクリア
          }
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher); // クリーンアップ
      };
    } else {
      console.error("このブラウザはGeolocation APIをサポートしていません。");
    }
  }, [inGeofence, dynamicMessage]); // dynamicMessageを依存配列に追加

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
