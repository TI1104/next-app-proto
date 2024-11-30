import "../styles/globals.css";
import { MessageProvider } from "../context/MessageContext";

export default function App({ Component, pageProps }) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}
