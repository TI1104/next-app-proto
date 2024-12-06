import React, { useState } from "react";
import { FirebaseController } from "../../lib/firebaseFunctions";  // FirebaseController をインポート

export default function Parent() {
  const [message, setMessage] = useState("");

  const handleInputChange = async (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

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
        onChange={handleInputChange}
        placeholder="メッセージを入力"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "80%",
          maxWidth: "400px",
        }}
      />
    </div>
  );
}
