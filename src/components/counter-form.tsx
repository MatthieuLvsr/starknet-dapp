"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAccount,
  useCall,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import CounterABIFile from "@/abis/counter.json";
const CounterABI = CounterABIFile.abi || CounterABIFile;
import { Abi } from "starknet";
import { Skeleton } from "@/components/ui/skeleton";

export default function CounterForm() {
  const { address, status } = useAccount();

  const {
    data: dataCounter,
    error: errorCall,
    status: statusCall,
    refetch: callCounter,
    fetchStatus,
  } = useCall({
    abi: CounterABI,
    functionName: "get_value",
    address:
      "0x016a1bc101f25137bd999d58e4453c68630c26b1043b97ba99cbeddf67ef7f69",
    watch: true,
  });

  const { contract } = useContract({
    abi: CounterABI as Abi,
    address:
      "0x016a1bc101f25137bd999d58e4453c68630c26b1043b97ba99cbeddf67ef7f69",
  });

  // INCREMENTATION
  const {
    send: increment,
    error: incrementError,
    isPending: incrementPending,
  } = useSendTransaction({
    calls:
      contract && address ? [contract.populate("increment", [1])] : undefined,
  });

  // DECREMENTATION
  const {
    send: decrement,
    error: decrementError,
    status: decrementStatus,
    isPending: descrementPending,
  } = useSendTransaction({
    calls:
      contract && address ? [contract.populate("decrement", [1])] : undefined,
  });

  // FIRST LOAD
  useEffect(() => {
    callCounter();
  }, []);

  return (
    <>
      {dataCounter && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="flex justify-center items-center text-4xl font-bold">
                {dataCounter.toString()}
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  disabled={descrementPending || incrementPending}
                  onClick={() => decrement()}
                  variant="outline"
                >
                  -
                </Button>
                <Button
                  type="button"
                  disabled={descrementPending || incrementPending}
                  onClick={() => increment()}
                >
                  +
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {!dataCounter && <CounterSkeleton />}
    </>
  );
}

const CounterSkeleton = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        {/* Skeleton pour le titre */}
        <Skeleton className="h-6 w-24 mx-auto" />
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {/* Skeleton pour l'affichage du compteur */}
          <div className="flex justify-center items-center">
            <Skeleton className="h-10 w-20" />
          </div>
          {/* Skeleton pour les boutons */}
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
