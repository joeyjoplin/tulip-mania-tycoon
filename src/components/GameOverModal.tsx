import { useState } from "react";
import { Button } from "./ui/button";

interface GameOverModalProps {
  isWin: boolean;
  finalCoins: number;
  finalDay: number;
  onRestart: () => void;
}

export const GameOverModal = ({ isWin, finalCoins, finalDay, onRestart }: GameOverModalProps) => {
  const [showEducationalScreen, setShowEducationalScreen] = useState(false);

  if (showEducationalScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="pixel-border bg-card p-8 max-w-2xl w-full space-y-6 animate-scale-in">
          <h1 className="text-2xl text-center mb-4">
            🌷 Por que as Tulipas eram Especulativas?
          </h1>

          <div className="space-y-4 text-xs leading-relaxed">
            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">💰 Valor Real vs. Valor Especulativo</h3>
              <p>
                Uma tulipa é apenas uma flor. Ela não produz alimento, não gera renda contínua, 
                e murcha em poucos dias. Seu <strong>valor real</strong> é apenas decorativo.
              </p>
            </div>

            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">📈 O Ciclo da Especulação</h3>
              <p className="mb-2">
                As pessoas não compravam tulipas para apreciá-las, mas para <strong>revender mais caro</strong>. 
                O preço subia não por seu valor real, mas pela crença de que sempre haveria alguém 
                disposto a pagar mais.
              </p>
              <p className="text-primary">
                "Compro hoje por 100, vendo amanhã por 200" - mas e quando ninguém mais quer comprar?
              </p>
            </div>

            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">💥 O Colapso Inevitável</h3>
              <p className="mb-2">
                Em fevereiro de 1637, durante um leilão, ninguém apareceu para comprar. 
                O mercado percebeu: <strong>não havia compradores finais</strong>, apenas especuladores.
              </p>
              <p className="text-destructive font-bold">
                Os preços despencaram 99% em semanas. Tulipas que valiam casas viraram... tulipas.
              </p>
            </div>

            <div className="pixel-border bg-primary/20 p-4 text-center">
              <p className="font-bold text-sm mb-2">🎓 A Grande Lição</p>
              <p>
                Quando o preço de algo sobe apenas porque todos esperam que continue subindo, 
                <strong className="text-accent"> não é investimento - é especulação</strong>.
              </p>
              <p className="mt-2 text-muted-foreground">
                E toda especulação, eventualmente, encontra a realidade.
              </p>
            </div>
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
  }

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

        <div className="flex gap-3">
          <Button
            onClick={() => setShowEducationalScreen(true)}
            variant="outline"
            className="pixel-button flex-1"
          >
            Saber Mais
          </Button>
          <Button
            onClick={onRestart}
            className="pixel-button flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Jogar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
};
