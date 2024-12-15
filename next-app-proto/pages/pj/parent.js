import React, { useState, useEffect } from "react";
import { FirebaseController } from "../../lib/firebaseFunctions";

export default function Parent() {
  const [message, setMessage] = useState(""); 
  const [statusMessage, setStatusMessage] = useState(""); // 保存状況のメッセージ

  // 初期ロード時にFirestoreからメッセージを取得
  useEffect(() => {
    const fetchMessage = async () => {
      const savedMessage = await FirebaseController.readMessage(); // Firestoreから保存されたメッセージを取得
      if (savedMessage) {
        setMessage(savedMessage);
      }
    };
    fetchMessage();
  }, []);

  const handleInputChange = async (e) => {
    const newMessage = e.target.value; 
    setMessage(newMessage);

    // Firestoreにメッセージを保存
    const result = await FirebaseController.writeMessage(newMessage);
    if (result) {
      setStatusMessage("メッセージを正常に上書きしました");
    } else {
      setStatusMessage("メッセージ保存に失敗しました");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>管理者用ページ</h2>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="メッセージを入力"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "80%",
          maxWidth: "400px",
        }}
      />
      <div>
        <p>現在の保存されているメッセージ: {message}</p>
      </div>
      <div>
        <p>{statusMessage}</p> {/* メッセージ保存の状態を表示 */}
      </div>
    </div>
  );
}
