import { useState, useEffect } from "react";
import { GameField } from "@/components/GameField";
import { MarketPanel } from "@/components/MarketPanel";
import { GameStats } from "@/components/GameStats";
import { GameOverModal } from "@/components/GameOverModal";
import { toast } from "sonner";

const INITIAL_COINS = 100;
const INITIAL_PRICE = 20;
const WINNING_COINS = 500;
const CRASH_DAY = 30;

const Index = () => {
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [day, setDay] = useState(1);
  const [tulipsInInventory, setTulipsInInventory] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [priceHistory, setPriceHistory] = useState<number[]>([INITIAL_PRICE]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Price calculation based on day (simulating bubble)
  const calculatePrice = (currentDay: number): number => {
    if (currentDay >= CRASH_DAY) {
      return Math.floor(INITIAL_PRICE * 0.1); // Crash!
    }
    
    if (currentDay < 15) {
      // Rapid growth phase
      return Math.floor(INITIAL_PRICE * (1 + currentDay * 0.3));
    } else if (currentDay < 25) {
      // Peak with volatility
      const base = INITIAL_PRICE * 5;
      const volatility = Math.sin(currentDay) * 20;
      return Math.floor(base + volatility);
    } else {
      // Pre-crash decline
      const daysTowardsEnd = currentDay - 25;
      return Math.floor(INITIAL_PRICE * 5 * (1 - daysTowardsEnd * 0.15));
    }
  };

  // Day advancement
  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        
        if (newDay === CRASH_DAY) {
          setGameOver(true);
          setIsWin(false);
          toast.error("💥 O mercado colapsou!", {
            description: "As tulipas não valem mais nada..."
          });
        }
        
        if (newDay === 15) {
          toast.warning("⚠️ O mercado está muito volátil...", {
            description: "Será que isso pode continuar?"
          });
        }
        
        if (newDay === 25) {
          toast.error("🔴 Sinais de pânico no mercado!", {
            description: "Alguns investidores estão vendendo tudo..."
          });
        }
        
        return newDay;
      });
    }, 8000); // Advance day every 8 seconds

    return () => clearInterval(dayInterval);
  }, []);

  // Price update
  useEffect(() => {
    const newPrice = calculatePrice(day);
    setCurrentPrice(newPrice);
    setPriceHistory(prev => [...prev, newPrice]);
  }, [day]);

  // Check win condition
  useEffect(() => {
    if (coins >= WINNING_COINS && !gameOver) {
      setGameOver(true);
      setIsWin(true);
      toast.success("🎉 Você venceu!", {
        description: `Acumulou ${coins} moedas antes do crash!`
      });
    }
  }, [coins, gameOver]);

  const handleHarvest = (count: number) => {
    setTulipsInInventory(prev => prev + count);
    toast.success("🌷 Tulipa colhida!", {
      description: "Pronta para venda!"
    });
  };

  const handleSpendCoins = (amount: number) => {
    setCoins(prev => prev - amount);
  };

  const handleSell = () => {
    const earnings = tulipsInInventory * currentPrice;
    setCoins(prev => prev + earnings);
    setTulipsInInventory(0);
    toast.success(`💰 Vendeu ${tulipsInInventory} tulipas!`, {
      description: `Ganhou ${earnings} moedas`
    });
  };

  const handleRestart = () => {
    setCoins(INITIAL_COINS);
    setDay(1);
    setTulipsInInventory(0);
    setCurrentPrice(INITIAL_PRICE);
    setPriceHistory([INITIAL_PRICE]);
    setGameOver(false);
    setIsWin(false);
    setShowTutorial(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl mb-2">🌷 Tulipas Game</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Holanda, século XVII - A era da Tulipmania
          </p>
        </header>

        {/* Tutorial Toast */}
        {showTutorial && (
          <div className="pixel-border bg-primary/10 p-4 text-center animate-fade-in">
            <p className="text-xs mb-2">
              👩‍🌾 Plante tulipas no campo, espere crescer, venda no mercado!
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              🎯 Objetivo: Acumular {WINNING_COINS} moedas antes do dia {CRASH_DAY}
            </p>
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-xs underline hover:no-underline"
            >
              Entendi!
            </button>
          </div>
        )}

        {/* Stats */}
        <GameStats 
          coins={coins} 
          day={day} 
          tulipsInInventory={tulipsInInventory} 
        />

        {/* Main Game Area */}
        <div className="grid md:grid-cols-2 gap-6">
          <GameField
            onHarvest={handleHarvest}
            coins={coins}
            onSpendCoins={handleSpendCoins}
          />
          
          <MarketPanel
            currentPrice={currentPrice}
            tulipsInInventory={tulipsInInventory}
            onSell={handleSell}
            day={day}
            priceHistory={priceHistory}
          />
        </div>

        {/* Educational Tips */}
        <div className="pixel-border bg-muted/30 p-4 text-center">
          <p className="text-xs">
            {day < 10 && "💡 Os preços estão subindo rapidamente... mas será que é real?"}
            {day >= 10 && day < 20 && "⚖️ Nem todo crescimento é sustentável."}
            {day >= 20 && day < 25 && "🤔 O que acontece quando todos querem vender ao mesmo tempo?"}
            {day >= 25 && "⚠️ A ganância pode custar caro..."}
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground">
          <p>Um jogo educativo sobre a bolha das tulipas de 1637</p>
        </footer>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          isWin={isWin}
          finalCoins={coins}
          finalDay={day}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
