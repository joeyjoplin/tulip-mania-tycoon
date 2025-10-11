import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type GameRole = "farmer" | "merchant";

interface RoleSelectionScreenProps {
  onSelectRole: (role: GameRole) => void;
}

export const RoleSelectionScreen = ({ onSelectRole }: RoleSelectionScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">🌷 Tulipas Game</h1>
          <p className="text-lg text-muted-foreground">
            Holanda, século XVII - A era da Tulipmania
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Escolha seu papel nesta história de especulação e comércio
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">👩‍🌾</div>
              <CardTitle className="text-2xl">Camponesa</CardTitle>
              <CardDescription>Cultive e venda tulipas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-lg">🌱</span>
                  <span>Plante e cultive tulipas em seu campo</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">⏱️</span>
                  <span>Aguarde o crescimento e colha no momento certo</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">💰</span>
                  <span>Venda para mercadores pelo melhor preço</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Foco em produção e timing de venda</span>
                </p>
              </div>
              <Button 
                onClick={() => onSelectRole("farmer")} 
                className="w-full"
                size="lg"
              >
                Jogar como Camponesa
              </Button>
            </CardContent>
          </Card>

          {/* Merchant Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🧔‍♂️</div>
              <CardTitle className="text-2xl">Mercador</CardTitle>
              <CardDescription>Compre barato, venda caro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-lg">📊</span>
                  <span>Controle preços de compra e venda</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🤝</span>
                  <span>Negocie com fazendeiros e clientes</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">⚖️</span>
                  <span>Gerencie estoque e reputação</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Foco em estratégia e especulação</span>
                </p>
              </div>
              <Button 
                onClick={() => onSelectRole("merchant")} 
                className="w-full"
                size="lg"
              >
                Jogar como Mercador
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Educational Note */}
        <div className="text-center text-xs text-muted-foreground max-w-2xl mx-auto px-4 py-6 bg-muted/30 rounded-lg">
          <p className="mb-2">
            ⚠️ <strong>Aviso:</strong> Este é um jogo educativo sobre a bolha especulativa das tulipas de 1637
          </p>
          <p>
            Ambos os papéis enfrentarão o colapso do mercado. O objetivo é sobreviver e aprender sobre especulação financeira.
          </p>
        </div>
      </div>
    </div>
  );
};
