"use client";

import { ConnectKitButton } from "connectkit";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { isConnected } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => {
        return (
          <Button 
            onClick={show}
            size="sm"
            className={isConnected ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
} 