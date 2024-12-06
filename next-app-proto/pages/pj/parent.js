import React, { useState } from "react";
import { FirebaseController } from "../../lib/firebaseFunctions"; // FirebaseController をインポート

export default function Parent() {
  const [message, setMessage] = useState(""); // メッセージの状態を管理

  // 入力されたメッセージをFirebaseに保存し、状態を更新
  const handleInputChange = async (e) => {
    const newMessage = e.target.value; // 新しいメッセージ
    setMessage(newMessage); // メッセージ状態を更新（画面表示用）

    // Firestoreにメッセージを保存
    const result = await FirebaseController.writeMessage(newMessage);
    if (result) {
      console.log("メッセージが正常に保存されました");
    } else {
      console.log("メッセージ保存に失敗しました");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>管理者用ページ</h2>
      <input
        type="text"
        value={message}
        onChange={handleInputChange} // 入力されたメッセージで状態更新
        placeholder="メッセージを入力"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "80%",
          maxWidth: "400px",
        }}
      />
      <div>
        <p>現在のメッセージ: {message}</p> {/* 入力されたメッセージを画面に表示 */}
      </div>
    </div>
  );
}
