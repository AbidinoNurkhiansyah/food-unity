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

  useEffect(() => {
    if (user?.uid) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      if (!user?.uid) return;
      const token = await user.getIdToken();
      const data = await walletApi.getBalance(user.uid, token);
      setBalance(data.balance || 0);
    } catch (error) {
      toast.error("Gagal memuat informasi saldo");
    } finally {
      setIsLoading(false);
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
    showConfirm,
    setShowConfirm,
    handleWithdrawClick,
    processWithdrawal,
    handleSetMaxAmount,
    handleAmountChange
  };
}
