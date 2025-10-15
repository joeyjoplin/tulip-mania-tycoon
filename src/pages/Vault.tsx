import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Wallet, TrendingUp, Calendar } from "lucide-react";

const Vault = () => {
  const [balance, setBalance] = useState(1000);
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [daysDeposited, setDaysDeposited] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const dailyRate = 0.05; // 5% daily return

  useEffect(() => {
    if (depositedAmount > 0) {
      const earnings = depositedAmount * dailyRate * daysDeposited;
      setTotalEarnings(earnings);
    }
  }, [depositedAmount, daysDeposited]);

  const handleDeposit = () => {
    const amount = parseFloat(depositValue);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    if (amount > balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este depósito",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance - amount);
    setDepositedAmount(depositedAmount + amount);
    if (depositedAmount === 0) {
      setDaysDeposited(1);
    }
    setDepositValue("");
    setDepositDialogOpen(false);
    toast({
      title: "Depósito realizado!",
      description: `${amount} florins depositados com sucesso`,
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawValue);
    const totalAvailable = depositedAmount + totalEarnings;
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    if (amount > totalAvailable) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este saque",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance + amount);
    const newDeposited = Math.max(0, depositedAmount - amount);
    const newEarnings = Math.max(0, totalEarnings - (amount - (depositedAmount - newDeposited)));
    
    setDepositedAmount(newDeposited);
    setTotalEarnings(newEarnings);
    if (newDeposited === 0) {
      setDaysDeposited(0);
    }
    setWithdrawValue("");
    setWithdrawDialogOpen(false);
    toast({
      title: "Saque realizado!",
      description: `${amount} florins sacados com sucesso`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vault
            </h1>
            <p className="text-sm text-muted-foreground">
              Deposite fundos e ganhe retornos diários
            </p>
          </header>

          {/* Financial Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance.toFixed(2)} ƒ</div>
                <p className="text-xs text-muted-foreground">Florins disponíveis para depositar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Depósito</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{depositedAmount.toFixed(2)} ƒ</div>
                <p className="text-xs text-muted-foreground">{daysDeposited} dias rendendo {dailyRate * 100}% ao dia</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalEarnings.toFixed(2)} ƒ</div>
                <p className="text-xs text-muted-foreground">Rendimento acumulado</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="min-w-[150px]">Depositar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Depositar Fundos</DialogTitle>
                  <DialogDescription>
                    Deposite florins para começar a ganhar retornos diários de {dailyRate * 100}%
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deposit-amount">Valor</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      value={depositValue}
                      onChange={(e) => setDepositValue(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Saldo disponível: {balance.toFixed(2)} ƒ
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleDeposit}>Confirmar Depósito</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="min-w-[150px]">Sacar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sacar Fundos</DialogTitle>
                  <DialogDescription>
                    Retire seus fundos e ganhos a qualquer momento
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="withdraw-amount">Valor</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawValue}
                      onChange={(e) => setWithdrawValue(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Disponível para saque: {(depositedAmount + totalEarnings).toFixed(2)} ƒ
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleWithdraw}>Confirmar Saque</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Info Card */}
          {depositedAmount === 0 && (
            <Card className="bg-primary/5">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  Deposite fundos para começar a ganhar retornos diários e iniciar suas negociações de tulipas!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vault;
