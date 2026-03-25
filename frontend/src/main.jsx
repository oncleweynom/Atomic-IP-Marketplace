import React from "react";
import { createRoot } from "react-dom/client";
import { WalletProvider } from "./context/WalletContext";
import { WalletConnectButton } from "./components/WalletConnectButton";

/**
 * React entry point.
 * Mounts the WalletProvider and WalletConnectButton into #wallet-root.
 * The rest of the page (listings, key reveal) remains vanilla JS in app.js
 * and receives the connected wallet via a custom event.
 */

function WalletApp() {
  return (
    <WalletProvider>
      <WalletConnectButton />
    </WalletProvider>
  );
}

const container = document.getElementById("wallet-root");
if (container) {
  createRoot(container).render(<WalletApp />);
}
