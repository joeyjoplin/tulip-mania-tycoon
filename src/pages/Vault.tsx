/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { useState, useMemo, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Wallet, TrendingUp, Calendar, Coins, RefreshCcw, ArrowDownCircle, ArrowUpCircle, AlertTriangle,
} from "lucide-react";

import { fvDeposit, fvWithdraw, fvGetUnderlying } from "@/lib/feeVaultActions";

const STORAGE_KEY  = "sp:keyId";
const CONTRACT_KEY = "sp:contractId";

// ❗ Podem vir undefined se não estiverem no .env (mesmo se tipadas como string no TS)
const FEE_VAULT_ID = import.meta.env.VITE_FEE_VAULT_ID as string | undefined;
const RESERVE_ID   = import.meta.env.VITE_RESERVE_ID as string | undefined;
const SYMBOL       = (import.meta.env.VITE_RESERVE_SYMBOL as string) || "TOKEN";
const DECIMALS     = Number(import.meta.env.VITE_RESERVE_DECIMALS ?? 7);

// ---------- helpers ----------
function toBase(amountStr: string) {
  const n = Number(String(amountStr).replace(",", "."));
  if (Number.isNaN(n) || n <= 0) return null;
  return BigInt(Math.round(n * 10 ** DECIMALS));
}
function fromBase(n: bigint) {
  const f = Number(n) / 10 ** DECIMALS;
  return f.toLocaleString(undefined, {
    minimumFractionDigits: Math.min(DECIMALS, 7),
    maximumFractionDigits: Math.min(DECIMALS, 7),
  });
}
function shortAddr(addr?: string, chars = 6) {
  if (!addr) return "—";
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}

const Vault = () => {
  // Wallet (contractId) — carregamos do storage; sem Mercury/CORS
  const [contractId, setContractId] = useState<string>(localStorage.getItem(CONTRACT_KEY) || "");
  const [manualContract, setManualContract] = useState<string>("");

  // Estado on-chain
  const [underlying, setUnderlying] = useState<bigint | null>(null);

  // UI
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Visual apenas
  const [daysDeposited, setDaysDeposited] = useState(0);
  const dailyRate = 0.05;

  const signerKeyId = useMemo(() => localStorage.getItem(STORAGE_KEY) || "", []);

  // Verifica envs obrigatórias
  const missingEnv = useMemo(() => {
    const miss: string[] = [];
    if (!FEE_VAULT_ID) miss.push("VITE_FEE_VAULT_ID");
    if (!RESERVE_ID)   miss.push("VITE_RESERVE_ID");
    return miss;
  }, []);

  // Atualiza saldo quando já temos pre-reqs
  useEffect(() => {
    if (contractId && !missingEnv.length) {
      refreshUnderlying();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, missingEnv.length]);

  async function refreshUnderlying() {
    if (!FEE_VAULT_ID || !RESERVE_ID || !contractId) return;
    try {
      setLoading(true);
      const amount = await fvGetUnderlying({
        feeVaultId: FEE_VAULT_ID,
        reserveId: RESERVE_ID,
        userContractId: contractId,
      });
      setUnderlying(amount);
      if (amount > 0n && daysDeposited === 0) setDaysDeposited(1);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to check balance",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function ensurePrereqs(actionLabel: string): boolean {
    if (missingEnv.length) {
      toast({
        title: "Incomplete environment",
        description: `Set ${missingEnv.join(", ")} in .env to ${actionLabel}.`,
        variant: "destructive",
      });
      return false;
    }
    if (!signerKeyId) {
      toast({
        title: "Please log in with Passkey",
        description: "No keyId found on this device.",
        variant: "destructive",
      });
      return false;
    }
    if (!contractId) {
      toast({
        title: "Wallet not set",
        description: "Please enter/save your ContractId (Passkey wallet) before continuing.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  async function handleDeposit() {
    if (!ensurePrereqs("depositar")) return;

    const base = toBase(depositValue);
    if (base === null) {
      toast({ title: "Invalid amount", description: "Please enter a numeric value.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await fvDeposit({
        feeVaultId: FEE_VAULT_ID!,   // seguro, pois ensurePrereqs validou
        reserveId: RESERVE_ID!,
        userContractId: contractId,
        amount: base,
        signerKeyId,
      });
      setDepositValue("");
      setDepositDialogOpen(false);
      toast({ title: "Depósito enviado!", description: `+${Number(depositValue)} ${SYMBOL}` });
      await refreshUnderlying();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Deposit failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!ensurePrereqs("sacar")) return;

    const base = toBase(withdrawValue);
    if (base === null) {
      toast({ title: "Invalid amount", description: "Please enter a numeric value.", variant: "destructive" });
      return;
    }
    if (underlying !== null && base > underlying) {
      toast({ title: "Insufficient balance", description: "Requested amount exceeds balance in FeeVault.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await fvWithdraw({
        feeVaultId: FEE_VAULT_ID!,
        reserveId: RESERVE_ID!,
        userContractId: contractId,
        amount: base,
        signerKeyId,
      });
      setWithdrawValue("");
      setWithdrawDialogOpen(false);
      toast({ title: "Saque enviado!", description: `-${Number(withdrawValue)} ${SYMBOL}` });
      await refreshUnderlying();
      if (underlying === 0n) setDaysDeposited(0);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Withdrawal failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleSaveContractId() {
    const v = manualContract.trim();
    if (!v) {
      toast({ title: "Empty ContractId", description: "Please paste your ContractId to save.", variant: "destructive" });
      return;
    }
    localStorage.setItem(CONTRACT_KEY, v);
    setContractId(v);
    setManualContract("");
    toast({ title: "ContractId saved", description: "We'll use this address to operate in the FeeVault." });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vault
            </h1>
            <p className="text-sm text-muted-foreground">
              Deposit and withdraw from FeeVault using your Passkey wallet
            </p>
          </header>

          {/* Banner de ambiente faltante */}
          {missingEnv.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-base">Missing environment variables</CardTitle>
                  <CardDescription>
                    Set <code>{missingEnv.join(", ")}</code> in your <code>.env</code> and restart the app.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Resolver/Salvar ContractId sem Mercury (sem CORS) */}
          {!contractId && (
            <Card>
              <CardHeader>
                <CardTitle>Set up your Wallet (ContractId)</CardTitle>
                <CardDescription>
                  Paste your Passkey wallet's <strong>ContractId</strong> here.
                  For future logins, save this in localStorage as <code>sp:contractId</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="manual-contract">ContractId</Label>
                  <Input
                    id="manual-contract"
                    placeholder="CD... (your smart wallet address)"
                    value={manualContract}
                    onChange={(e) => setManualContract(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveContractId}>Save</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo no FeeVault</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {underlying !== null ? `${fromBase(underlying)} ${SYMBOL}` : "—"}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">Reserve: {shortAddr(RESERVE_ID, 4)}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshUnderlying}
                    disabled={loading || !contractId || missingEnv.length > 0}
                    className="h-7 px-2"
                  >
                    <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                    Atualizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Wallet</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shortAddr(contractId)}</div>
                <p className="text-xs text-muted-foreground">ContractId (wallet created with Passkey)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {underlying !== null && underlying > 0n ? `5% / day` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Visual indicator (UI only). Actual returns depend on the pool.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="min-w-[150px]"
                  disabled={!contractId || missingEnv.length > 0}
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit {SYMBOL}</DialogTitle>
                  <DialogDescription>
                    Send {SYMBOL} to FeeVault. Decimals: {DECIMALS}. FeeVault: {shortAddr(FEE_VAULT_ID, 4)}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="0.00"
                      value={depositValue}
                      onChange={(e) => setDepositValue(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDepositDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeposit} disabled={loading || missingEnv.length > 0}>
                    Confirm Deposit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[150px]"
                  disabled={!contractId || underlying === 0n || missingEnv.length > 0}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw {SYMBOL}</DialogTitle>
                  <DialogDescription>Withdraw your {SYMBOL} from FeeVault.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="0.00"
                      value={withdrawValue}
                      onChange={(e) => setWithdrawValue(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Available (estimated): {underlying !== null ? `${fromBase(underlying)} ${SYMBOL}` : "—"}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleWithdraw} disabled={loading || missingEnv.length > 0}>
                    Confirm Withdrawal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

    
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vault;

