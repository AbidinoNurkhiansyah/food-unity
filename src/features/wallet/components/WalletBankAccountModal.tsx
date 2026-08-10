import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WalletBankAccountModalProps {
  initialData?: {
    bankCode?: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  } | null;
  isLoading: boolean;
  onSubmit: (data: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  }) => Promise<void>;
  onClose: () => void;
}

const PAYMENT_METHODS = [
  {
    category: "Bank Transfer",
    methods: [
      { id: "bca", name: "BCA (Bank Central Asia)" },
      { id: "mandiri", name: "Bank Mandiri" },
      { id: "bni", name: "BNI (Bank Negara Indonesia)" },
      { id: "bri", name: "BRI (Bank Rakyat Indonesia)" },
      { id: "bsi", name: "Bank Syariah Indonesia (BSI)" },
      { id: "cimb", name: "CIMB Niaga" },
      { id: "permata", name: "Bank Permata" },
    ],
  },
  {
    category: "E-Wallet",
    methods: [
      { id: "gopay", name: "GoPay" },
      { id: "ovo", name: "OVO" },
      { id: "dana", name: "DANA" },
      { id: "shopeepay", name: "ShopeePay" },
      { id: "linkaja", name: "LinkAja" },
    ],
  },
];

export const WalletBankAccountModal: React.FC<WalletBankAccountModalProps> = ({
  initialData,
  isLoading,
  onSubmit,
  onClose,
}) => {
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  useEffect(() => {
    if (initialData) {
      setBankCode(initialData.bankCode || "");
      setBankName(initialData.bankName || "");
      setAccountNumber(initialData.accountNumber || "");
      setAccountHolderName(initialData.accountHolderName || "");
    }
  }, [initialData]);

  const handleBankChange = (code: string) => {
    setBankCode(code);
    for (const group of PAYMENT_METHODS) {
      const found = group.methods.find((m) => m.id === code);
      if (found) {
        setBankName(found.name);
        break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankCode || !bankName || !accountNumber || !accountHolderName) return;

    await onSubmit({ bankCode, bankName, accountNumber, accountHolderName });
    onClose();
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Payout Account
        </h3>
        <p className="text-sm text-slate-500">
          Configure the destination account for your withdrawals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-slate-700">
            Payment Method
          </Label>
          <Select value={bankCode} onValueChange={handleBankChange} required>
            <SelectTrigger className="w-full bg-transparent border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-md cursor-pointer">
              <SelectValue placeholder="Select bank or e-wallet" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((group) => (
                <SelectGroup key={group.category}>
                  <SelectLabel className="text-xs font-semibold text-slate-500 px-2 py-1.5">
                    {group.category}
                  </SelectLabel>
                  {group.methods.map((method) => (
                    <SelectItem
                      key={method.id}
                      value={method.id}
                      className="text-sm cursor-pointer"
                    >
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="accountNumber"
            className="text-sm font-medium text-slate-700"
          >
            Account Number / Phone No.
          </Label>
          <Input
            id="accountNumber"
            type="text"
            inputMode="numeric"
            placeholder="E.g. 1234567890"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/\D/g, ""))
            }
            required
            className="w-full bg-transparent border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900 rounded-md font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="accountHolderName"
            className="text-sm font-medium text-slate-700"
          >
            Account Holder Name
          </Label>
          <Input
            id="accountHolderName"
            type="text"
            placeholder="E.g. JOHN DOE"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
            required
            className="w-full bg-transparent border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900 rounded-md text-sm uppercase"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isLoading || !bankCode || !accountNumber || !accountHolderName
            }
            className="rounded-md cursor-pointer bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 min-w-[120px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
