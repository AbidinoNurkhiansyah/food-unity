import { useState } from "react";
import { useAuthStore } from "@/features/auth";
import { walletApi } from "../services/walletApi";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useWallet() {
  const { user } = useAuthStore();
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['walletBalance', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return { balance: 0 };
      const token = await user.getIdToken();
      return walletApi.getBalance(user.uid, token);
    },
    enabled: !!user?.uid,
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['walletHistory', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const token = await user.getIdToken();
      return walletApi.getHistory(user.uid, token);
    },
    enabled: !!user?.uid,
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.uid) throw new Error("User not authenticated");
      const token = await user.getIdToken();
      return walletApi.withdrawBalance(user.uid, amount, token);
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Successfully withdrew Rp ${variables.toLocaleString("id-ID")}`
      );
      setAmountToWithdraw("");
      queryClient.invalidateQueries({ queryKey: ['walletBalance', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['walletHistory', user?.uid] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to withdraw funds");
    },
  });

  const balance = balanceData?.balance || 0;
  const history = historyData || [];
  const isLoading = isLoadingBalance;
  const isWithdrawing = withdrawMutation.isPending;

  const handleWithdrawClick = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 

    if (amount <= 0) {
      toast.error("Invalid withdrawal amount");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setShowConfirm(true);
  };

  const processWithdrawal = () => {
    setShowConfirm(false);
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 
    withdrawMutation.mutate(amount);
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
