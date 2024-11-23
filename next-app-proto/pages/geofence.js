import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Geofence() {
  const [message, setMessage] = useState("");
  const [inGeofence, setInGeofence] = useState(false);

  // ジオフェンスの設定
  const targetLatitude = 36.700160; // 緯度 
  const targetLongitude = 137.101312; // 経度
  const targetRadius = 0.1; // 半径 0.1km (100m)

  // 距離計算関数
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球の半径 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 距離をkmで返す
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(
            latitude,
            longitude,
            targetLatitude,
            targetLongitude
          );

          if (distance <= targetRadius && !inGeofence) {
            setMessage("Hello");
            setInGeofence(true);

            // スマートフォンを振動
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          } else if (distance > targetRadius && inGeofence) {
            setMessage("");
            setInGeofence(false);
          }
        },
        (error) => {
          console.error("位置情報の取得に失敗しました: ", error);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher);
      };
    } else {
      console.error("このブラウザはGeolocation APIをサポートしていません。");
    }
  }, [inGeofence]);

  return (
    <div className={styles.container}>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
