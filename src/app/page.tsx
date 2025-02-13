"use client";

import CounterForm from "@/components/counter-form";
import { Button } from "@/components/ui/button";
import {
  braavos,
  useAccount,
  useBalance,
  useCall,
  useConnect,
  useContract,
  useDisconnect,
  useReadContract,
  useSendTransaction,
} from "@starknet-react/core";
import { LogIn, LogOut, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { abi as CounterABI} from "@/abis/counter.json";

export default function Home() {
  const { address, status } = useAccount();
  const {
    connect,
    connectors,
    error,
    status: connectionStatus,
  } = useConnect({});
  const [connected, setConnected] = useState(false);
  const [counter_value, setCounterValue] = useState("0");
  const {
    data,
    error: BalanceError,
    refetch,
  } = useBalance({
    address,
    watch: true
  });
  const { disconnect } = useDisconnect({});

  useEffect(() => {
    if (status === "disconnected") {
      setConnected(false);
    } else if (status === "connected") {
      setConnected(true);
      refetch();
      console.log(address, data)
    }
  }, [address, status]);

  const handleToggleLogin = () => {
    if (connected) {
      disconnect()
    } else {
      if (connectors.length > 0) {
        console.log(connectors)
        connect({ connector: braavos() });
      }
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
      {connected && (
          <>
            <CounterForm/>
            <div className="flex items-center space-x-2">
              <Wallet className="text-primary" />
              <span className="font-semibold">Adresse:</span>
              <span className="text-sm overflow-hidden text-ellipsis">{address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LogIn className="text-primary" />
              <span className="font-semibold">Balance:</span>
              <span>{data?.formatted} {data?.symbol}</span>
            </div>
          </>
        )}
      <Button onClick={handleToggleLogin} className="w-full">
          {connected ? (
            <>
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Connexion
            </>
          )}
        </Button>
        {error?.message}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
