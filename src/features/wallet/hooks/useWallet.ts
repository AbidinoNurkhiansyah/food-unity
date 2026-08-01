import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import { walletApi } from "../services/walletApi";
import { toast } from "sonner";

export function useWallet() {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState<number>(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.uid) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsHistoryLoading(true);
      if (!user?.uid) return;
      const token = await user.getIdToken();
      
      const [balanceData, historyData] = await Promise.all([
        walletApi.getBalance(user.uid, token),
        walletApi.getHistory(user.uid, token)
      ]);
      
      setBalance(balanceData.balance || 0);
      setHistory(historyData || []);
    } catch (error) {
      toast.error("Gagal memuat informasi dompet");
    } finally {
      setIsLoading(false);
      setIsHistoryLoading(false);
    }
  };

  const handleWithdrawClick = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 

    if (amount <= 0) {
      toast.error("Nominal penarikan tidak valid");
      return;
    }

    if (amount > balance) {
      toast.error("Saldo tidak mencukupi");
      return;
    }

    setShowConfirm(true);
  };

  const processWithdrawal = async () => {
    setShowConfirm(false);
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 
    
    try {
      setIsWithdrawing(true);
      if (!user?.uid) return;

      const token = await user.getIdToken();
      const response = await walletApi.withdrawBalance(user.uid, amount, token);
      toast.success(
        `Berhasil menarik dana sebesar Rp ${amount.toLocaleString("id-ID")}`
      );
      setBalance(response.remainingBalance);
      setAmountToWithdraw("");
      fetchData(); // Refresh history
    } catch (error: any) {
      toast.error(error.message || "Gagal melakukan penarikan dana");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSetMaxAmount = () => {
    setAmountToWithdraw(balance.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setAmountToWithdraw("");
    } else {
      setAmountToWithdraw(value);
    }
  };

  return {
    balance,
    amountToWithdraw,
    isLoading,
    isWithdrawing,
    history,
    isHistoryLoading,
    showConfirm,
    setShowConfirm,
    handleWithdrawClick,
    processWithdrawal,
    handleSetMaxAmount,
    handleAmountChange
  };
}
