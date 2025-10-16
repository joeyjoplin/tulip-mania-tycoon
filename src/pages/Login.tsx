import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Fingerprint, Shield, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PasskeyKit } from "passkey-kit";
import { server } from "@/lib/common";

const STORAGE_KEY = "sp:keyId";
const CONTRACT_KEY = "sp:contractId";

const Login = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const kit = useMemo(() => {
    return new PasskeyKit({
      rpcUrl: import.meta.env.VITE_rpcUrl,
      networkPassphrase: import.meta.env.VITE_networkPassphrase,
      walletWasmHash: import.meta.env.VITE_walletWasmHash,
      timeoutInSeconds: 30,
    });
  }, []);

  async function handleFirstAccess() {
    setIsAuthenticating(true);
    try {
      const defaultName = `Trader ${Math.floor(Math.random() * 10_000)}`;
      const user = prompt("Enter a name for your Passkey", defaultName) || defaultName;

      const { keyId, keyIdBase64, contractId, signedTx } = await kit.createWallet("Tulip Trader", user);

      // Deploy wallet
      await server.send(signedTx);

      // Persistence
      const keyIdStr =
        (keyIdBase64 as string) ||
        (typeof keyId === "string"
          ? (keyId as string)
          : btoa(String.fromCharCode(...new Uint8Array(keyId as any))));
      localStorage.setItem(STORAGE_KEY, keyIdStr);
      localStorage.setItem(CONTRACT_KEY, contractId); // <<< saves the contractId

      toast({ title: "Passkey created!", description: "Your wallet has been deployed and you are now authenticated." });
      navigate("/vault");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to create Passkey", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function handleReturningLogin() {
    setIsAuthenticating(true);
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY) || undefined;

      const { keyId, contractId } = await kit.connectWallet({
        keyId: storedKey,
        getContractId: (keyId: string) => server.getContractId({ keyId }),
      });

      // Garante consistência
      const keyIdStr =
        typeof keyId === "string"
          ? (keyId as string)
          : btoa(String.fromCharCode(...new Uint8Array(keyId as any)));
      localStorage.setItem(STORAGE_KEY, keyIdStr);
      if (contractId) localStorage.setItem(CONTRACT_KEY, contractId); // <<< salva o contractId

      toast({ title: "Authentication successful!", description: "Welcome back!" });
      navigate("/vault");
    } catch (err: any) {
      console.error(err);
      const msg = String(err?.message || "").toLowerCase();
      const name = String(err?.name || "");
      if (msg.includes("not allowed") || name.includes("NotAllowedError")) {
        toast({ title: "No Passkey found", description: "Let's create your Passkey now." });
        await handleFirstAccess();
      } else {
        toast({ title: "Passkey login failed", description: err?.message ?? "Please try again.", variant: "destructive" });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Passkey Authentication</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                WebAuthn — biometrics, no password
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleReturningLogin} disabled={isAuthenticating}>
                  Return
                </Button>
                <Button className="w-full" size="lg" onClick={handleFirstAccess} disabled={isAuthenticating}>
                  First Access
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>After authenticating, you will be redirected.</span>
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Your device needs to support biometrics/Passkey (FaceID, TouchID, Windows Hello, etc.)
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
