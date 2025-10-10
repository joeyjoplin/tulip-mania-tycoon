import { Button } from "./ui/button";

interface GameOverModalProps {
  isWin: boolean;
  finalCoins: number;
  finalDay: number;
  onRestart: () => void;
}

export const GameOverModal = ({ isWin, finalCoins, finalDay, onRestart }: GameOverModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="pixel-border bg-card p-8 max-w-lg w-full space-y-6 animate-scale-in">
        <h1 className="text-3xl text-center mb-4">
          {isWin ? "🎉 Vitória!" : "📉 Crash do Mercado"}
        </h1>
        
        {isWin ? (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Parabéns! Você acumulou <strong className="text-accent">{finalCoins} moedas</strong> antes 
              do colapso do mercado de tulipas!
            </p>
            <p>
              Você demonstrou sabedoria ao vender suas tulipas no momento certo, 
              antes que a bolha especulativa explodisse.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              No dia {finalDay}, o mercado de tulipas entrou em colapso. 
              Você terminou com <strong className="text-accent">{finalCoins} moedas</strong>.
            </p>
            <p className="text-destructive">
              As tulipas que valiam fortunas agora não valem quase nada...
            </p>
          </div>
        )}

        <div className="pixel-border bg-muted/30 p-4 space-y-3 text-xs leading-relaxed">
          <h3 className="font-bold text-center text-sm">📚 A Lição da Tulipmania</h3>
          <p>
            Entre 1636-1637, na Holanda, o preço das tulipas subiu a níveis absurdos. 
            Uma única tulipa rara podia valer mais que uma casa!
          </p>
          <p>
            Mas era uma <strong>bolha especulativa</strong>: o preço não refletia o valor real. 
            Quando o mercado percebeu isso, os preços despencaram.
          </p>
          <p className="text-center font-bold mt-2">
            ⚖️ Nem todo crescimento é sustentável.
          </p>
        </div>

        <Button
          onClick={onRestart}
          className="pixel-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
};
