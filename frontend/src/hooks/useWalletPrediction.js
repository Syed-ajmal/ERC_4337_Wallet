import { useCallback, useEffect, useRef, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  getWalletDetails,
  getWalletTransactions,
  predictWallet,
} from "../services/wallet.service.js";

export function useWalletPrediction() {
  const { address, isConnected } = useAppKitAccount({ namespace: "eip155" });
  const [prediction, setPrediction] = useState(null);
  const [walletDetails, setWalletDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [walletDetailsError, setWalletDetailsError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyTimer = useRef(null);

  useEffect(() => {
    if (!isConnected || !address) {
      return undefined;
    }

    let isCurrentRequest = true;
    Promise.resolve()
      .then(() => {
        if (!isCurrentRequest) return null;

        setPrediction(null);
        setWalletDetails(null);
        setTransactions([]);
        setError("");
        setIsLoading(true);
        setIsActivityLoading(false);
        setWalletDetailsError("");
        setTransactionsError("");

        return predictWallet(address);
      })
      .then((result) => {
        if (!isCurrentRequest || !result) return;

        setPrediction(result);
        setIsLoading(false);
        setIsActivityLoading(true);

        Promise.allSettled([
          getWalletDetails(result.smartWalletAddress),
          getWalletTransactions(result.smartWalletAddress, 1, 5),
        ])
          .then(([detailsResult, transactionsResult]) => {
            if (!isCurrentRequest) return;

            if (detailsResult.status === "fulfilled") {
              setWalletDetails(detailsResult.value);
            } else {
              setWalletDetailsError(detailsResult.reason.message);
            }

            if (transactionsResult.status === "fulfilled") {
              setTransactions(transactionsResult.value.transactions || []);
            } else {
              setTransactionsError(transactionsResult.reason.message);
            }
          })
          .finally(() => {
            if (isCurrentRequest) setIsActivityLoading(false);
          });
      })
      .catch((requestError) => {
        if (isCurrentRequest) setError(requestError.message);
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [address, isConnected, retryCount]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  const copyAddress = useCallback(async () => {
    if (!prediction?.smartWalletAddress) return;

    try {
      await navigator.clipboard.writeText(prediction.smartWalletAddress);
      setCopied(true);
      setCopyError("");
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError(
        "Could not copy automatically. Select and copy the address above.",
      );
    }
  }, [prediction]);

  return {
    address,
    isConnected,
    prediction,
    walletDetails,
    transactions,
    error,
    isLoading,
    isActivityLoading,
    walletDetailsError,
    transactionsError,
    copied,
    copyError,
    retry,
    copyAddress,
  };
}
