import { useMessage } from "../../context/MessageContext";

export default function Care() {
  const { message, setMessage } = useMessage();

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>介護対象用ページ</h2>
      <p>現在のメッセージ: {message}</p>
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
