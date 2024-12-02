import { useState, useEffect } from "react";
import { useMessage } from "../../context/MessageContext";
import styles from "../../styles/Home.module.css";
import { controlSwitchBotBot } from "./switchbotControl";

export default function Geofence() {
  const { message: dynamicMessage } = useMessage();
  const [message, setMessage] = useState("");
  const [inGeofence, setInGeofence] = useState(false);

  const targetLatitude = 36.703437;
  const targetLongitude = 137.101312;
  const targetRadius = 1.0;

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

  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(
            latitude,
            longitude,
            targetLatitude,
            targetLongitude
          );

          if (distance <= targetRadius && !inGeofence) {
            setMessage(dynamicMessage);
            setInGeofence(true);

            // バイブレーション
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }

            // SwitchBot Botの操作
            const deviceMac = "D3:6E:6C:CA:81:2E";
            await controlSwitchBotBot(deviceMac, "press");

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
  }, [inGeofence, dynamicMessage]);

  return (
    <div className={styles.container}>
      {message ? (
        <p className={styles.message}>{message}</p>
      ) : (
        <img src="/coco.jpg" alt="Coco" className={styles.image} />
      )}
      {/* ユーザー操作でBluetoothスキャンを開始 */}
      <button id="startBluetoothBtn">Start Bluetooth Scanning</button>
    </div>
  );
}