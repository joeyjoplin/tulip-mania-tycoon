import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Fingerprint, Shield, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handlePasskeyLogin = async () => {
    setIsAuthenticating(true);
    
    // Simular verificação biométrica
    toast({
      title: "Verificando identidade...",
      description: "Use sua biometria para continuar",
    });

    // Simular delay de autenticação
    setTimeout(() => {
      toast({
        title: "Autenticação bem-sucedida!",
        description: "Bem-vindo de volta, trader!",
      });
      
      setTimeout(() => {
        navigate("/game");
      }, 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Branding */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Treasury Games
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Play-to-Save Platform
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-2">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Acesso Seguro</CardTitle>
              <CardDescription>
                Faça login com sua biometria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passkey Login Button */}
              <div className="space-y-4">
                <Button
                  onClick={handlePasskeyLogin}
                  disabled={isAuthenticating}
                  className="w-full h-24 text-lg relative overflow-hidden group"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all" />
                  <div className="relative flex flex-col items-center gap-2">
                    <Fingerprint className={`w-10 h-10 ${isAuthenticating ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold">
                      {isAuthenticating ? 'Autenticando...' : 'Login com Passkey'}
                    </span>
                  </div>
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Autenticação biométrica segura</span>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  O que é Passkey?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Passkey é uma forma moderna e segura de autenticação que usa sua biometria 
                  (impressão digital, Face ID) ou PIN do dispositivo. Sem senhas para lembrar!
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">100% Seguro</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Biométrico</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Sem Senhas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <p className="text-xs text-center text-muted-foreground">
            Primeiro acesso? O sistema criará automaticamente sua Passkey
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
