import { createContext, useContext, useState } from "react";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [message, setMessage] = useState("Hello");
  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
