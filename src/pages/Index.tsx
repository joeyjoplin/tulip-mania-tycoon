import { useState, useEffect } from "react";
import { GameField } from "@/components/GameField";
import { MarketPanel } from "@/components/MarketPanel";
import { GameStats } from "@/components/GameStats";
import { GameOverModal } from "@/components/GameOverModal";
import { PricingControls } from "@/components/PricingControls";
import { OffersList, Offer } from "@/components/OffersList";
import { NewsPanel } from "@/components/NewsPanel";
import { RiskControls } from "@/components/RiskControls";
import { RoleSelectionScreen, GameRole } from "@/components/RoleSelectionScreen";
import { toast } from "sonner";

// Game constants
const INITIAL_COINS = 1000; // Start with more money as merchant
const INITIAL_PRICE = 20;
const WINNING_COINS = 5000; // Victory condition
const CRASH_DAY = 30;
const DAILY_DECAY = 0.08; // 8% daily stock decay
const SHOP_COST = 30; // Fixed daily shop cost
const STORAGE_COST_PER_TULIP = 2; // Storage cost per tulip
const HOLD_STOCK_COST = 50; // Cost to protect stock
const SURVIVAL_REPUTATION = 60; // Minimum reputation for survival

const Index = () => {
  // Role selection state
  const [selectedRole, setSelectedRole] = useState<GameRole | null>(null);
  
  // Core game state
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [day, setDay] = useState(1);
  const [stock, setStock] = useState(0); // Tulips in inventory
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [priceHistory, setPriceHistory] = useState<number[]>([INITIAL_PRICE]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  
  // New merchant mechanics
  const [reputation, setReputation] = useState(100);
  const [hype, setHype] = useState(50);
  const [bidPrice, setBidPrice] = useState(INITIAL_PRICE);
  const [askPrice, setAskPrice] = useState(INITIAL_PRICE + 5);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newsEvent, setNewsEvent] = useState("");
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);
  const [stockProtected, setStockProtected] = useState(false);

  // Price calculation with hype influence (simulating bubble)
  const calculatePrice = (currentDay: number, currentHype: number): number => {
    if (currentDay >= CRASH_DAY) {
      return Math.floor(INITIAL_PRICE * 0.1); // Crash!
    }
    
    const hypeMultiplier = 1 + (currentHype / 100);
    
    if (currentDay < 15) {
      // Rapid growth phase
      return Math.floor(INITIAL_PRICE * (1 + currentDay * 0.3) * hypeMultiplier);
    } else if (currentDay < 25) {
      // Peak with volatility
      const base = INITIAL_PRICE * 5;
      const volatility = Math.sin(currentDay) * 20;
      return Math.floor((base + volatility) * hypeMultiplier);
    } else {
      // Pre-crash decline
      const daysTowardsEnd = currentDay - 25;
      return Math.floor(INITIAL_PRICE * 5 * (1 - daysTowardsEnd * 0.15) * hypeMultiplier);
    }
  };

  // Generate random farmer or client offer
  const generateOffer = (): Offer => {
    const isFarmer = Math.random() > 0.5;
    const farmerNames = ["Hans", "Pieter", "Jan", "Willem", "Dirk"];
    const clientNames = ["Burgomaster", "Comerciante Rico", "Nobre", "Banqueiro"];
    
    if (isFarmer) {
      return {
        id: `farmer-${Date.now()}-${Math.random()}`,
        type: "farmer",
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(currentPrice * (0.7 + Math.random() * 0.3)), // 70-100% of market
        name: farmerNames[Math.floor(Math.random() * farmerNames.length)]
      };
    } else {
      return {
        id: `client-${Date.now()}-${Math.random()}`,
        type: "client",
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(currentPrice * (1.1 + Math.random() * 0.4)), // 110-150% of market
        name: clientNames[Math.floor(Math.random() * clientNames.length)]
      };
    }
  };

  // Generate news events based on market state
  const generateNewsEvent = (currentDay: number, currentHype: number): string => {
    if (currentDay >= 25) {
      const panicNews = [
        "💥 Rumores de colapso se espalham!",
        "😰 Investidores em pânico começam a vender!",
        "📉 Sinais de saturação do mercado!"
      ];
      return panicNews[Math.floor(Math.random() * panicNews.length)];
    } else if (currentDay >= 20) {
      return "⚠️ Analistas questionam sustentabilidade dos preços";
    } else if (currentDay >= 15) {
      const hypeNews = [
        "🔥 Tulipmania atinge novo pico!",
        "💰 Fortunas sendo feitas com tulipas!",
        "✨ Nobreza paga fortunas por tulipas raras!"
      ];
      return hypeNews[Math.floor(Math.random() * hypeNews.length)];
    } else if (currentHype > 70) {
      return "📈 Demanda por tulipas cresce exponencialmente!";
    }
    return "";
  };

  // Day advancement with daily costs and decay
  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        
        // Apply daily costs
        const storageCost = stock * STORAGE_COST_PER_TULIP;
        const totalDailyCost = SHOP_COST + storageCost;
        setCoins(c => Math.max(0, c - totalDailyCost));
        
        // Apply stock decay (8% or 4% if protected)
        const decayRate = stockProtected ? 0.04 : DAILY_DECAY;
        setStock(s => Math.floor(s * (1 - decayRate)));
        setStockProtected(false); // Protection lasts only one day
        setIsFlashSaleActive(false); // Flash sale lasts only one day
        
        // Update hype based on day
        if (newDay < 15) {
          setHype(h => Math.min(100, h + 5)); // Hype increases
        } else if (newDay >= 25) {
          setHype(h => Math.max(0, h - 10)); // Hype decreases rapidly
        } else {
          setHype(h => Math.max(0, h - 2)); // Slow decrease
        }
        
        // Generate news event
        const news = generateNewsEvent(newDay, hype);
        if (news) {
          setNewsEvent(news);
          setTimeout(() => setNewsEvent(""), 6000); // Clear after 6 seconds
        }
        
        // Generate new offers
        if (Math.random() > 0.3) { // 70% chance to generate offer
          setOffers(prev => [...prev, generateOffer()]);
        }
        
        // Market events
        if (newDay === CRASH_DAY) {
          setGameOver(true);
          const survived = coins >= 0 && reputation >= SURVIVAL_REPUTATION;
          setIsWin(survived);
          toast.error("💥 O mercado colapsou!", {
            description: survived ? "Mas você sobreviveu!" : "As tulipas não valem mais nada..."
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
  }, [stock, stockProtected, hype, coins, reputation]);

  // Price update with hype influence
  useEffect(() => {
    const newPrice = calculatePrice(day, hype);
    setCurrentPrice(newPrice);
    setPriceHistory(prev => [...prev, newPrice]);
    
    // Update bid/ask to follow market (with some delay)
    setBidPrice(Math.floor(newPrice * 0.9));
    setAskPrice(Math.floor(newPrice * 1.1));
  }, [day, hype]);

  // Check win condition (victory before crash)
  useEffect(() => {
    if (coins >= WINNING_COINS && !gameOver && day < CRASH_DAY) {
      setGameOver(true);
      setIsWin(true);
      toast.success("🎉 Você venceu!", {
        description: `Acumulou ${coins} florins antes do crash!`
      });
    }
  }, [coins, gameOver, day]);

  // Handle accepting an offer
  const handleAcceptOffer = (offer: Offer) => {
    if (offer.type === "farmer") {
      // Buy from farmer
      const totalCost = offer.price * offer.quantity;
      if (coins >= totalCost) {
        setCoins(c => c - totalCost);
        setStock(s => s + offer.quantity);
        setReputation(r => Math.min(100, r + 2)); // Good deal increases reputation
        toast.success(`✅ Comprou ${offer.quantity} tulipas de ${offer.name}!`, {
          description: `Custo: ${totalCost} florins`
        });
      } else {
        toast.error("💸 Florins insuficientes!");
        setReputation(r => Math.max(0, r - 5)); // Rejecting due to lack of funds hurts reputation
      }
    } else {
      // Sell to client
      if (stock >= offer.quantity) {
        const earnings = offer.price * offer.quantity;
        setCoins(c => c + earnings);
        setStock(s => s - offer.quantity);
        setReputation(r => Math.min(100, r + 3)); // Good sale increases reputation more
        toast.success(`✅ Vendeu ${offer.quantity} tulipas para ${offer.name}!`, {
          description: `Ganhou: ${earnings} florins`
        });
      } else {
        toast.error("🌷 Estoque insuficiente!");
        setReputation(r => Math.max(0, r - 5)); // Can't fulfill order hurts reputation
      }
    }
    // Remove the offer
    setOffers(prev => prev.filter(o => o.id !== offer.id));
  };

  // Handle rejecting an offer
  const handleRejectOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    setReputation(r => Math.max(0, r - 1)); // Small reputation penalty
  };

  // Risk management: Hold Stock (reduce decay)
  const handleHoldStock = () => {
    if (coins >= HOLD_STOCK_COST) {
      setCoins(c => c - HOLD_STOCK_COST);
      setStockProtected(true);
      toast.success("🛡️ Estoque protegido!", {
        description: "Decay reduzido para 4% por 1 dia"
      });
    } else {
      toast.error("💸 Florins insuficientes!");
    }
  };

  // Risk management: Flash Sale (temporary price reduction)
  const handleFlashSale = () => {
    if (stock > 0 && !isFlashSaleActive) {
      setIsFlashSaleActive(true);
      setAskPrice(Math.floor(askPrice * 0.8)); // 20% discount
      toast.success("⚡ Promoção ativada!", {
        description: "Preço de venda reduzido por 1 dia"
      });
    } else if (stock === 0) {
      toast.error("🌷 Sem estoque para promoção!");
    }
  };

  // Keep old farming mechanics for continuity
  const handleHarvest = (count: number) => {
    setStock(prev => prev + count);
    toast.success("🌷 Tulipa colhida!", {
      description: "Adicionada ao estoque!"
    });
  };

  const handleSpendCoins = (amount: number) => {
    setCoins(prev => prev - amount);
  };

  const handleSell = () => {
    if (stock === 0) {
      toast.error("🌷 Sem tulipas no estoque!");
      return;
    }
    const earnings = stock * askPrice;
    setCoins(prev => prev + earnings);
    setStock(0);
    toast.success(`💰 Vendeu todo o estoque!`, {
      description: `Ganhou ${earnings} florins`
    });
  };

  const handleRestart = () => {
    setSelectedRole(null); // Go back to role selection
    setCoins(INITIAL_COINS);
    setDay(1);
    setStock(0);
    setCurrentPrice(INITIAL_PRICE);
    setPriceHistory([INITIAL_PRICE]);
    setGameOver(false);
    setIsWin(false);
    setShowTutorial(true);
    setReputation(100);
    setHype(50);
    setBidPrice(INITIAL_PRICE);
    setAskPrice(INITIAL_PRICE + 5);
    setOffers([]);
    setNewsEvent("");
    setIsFlashSaleActive(false);
    setStockProtected(false);
  };

  const handleRoleSelection = (role: GameRole) => {
    setSelectedRole(role);
    setShowTutorial(true);
  };

  // Show role selection screen if no role selected
  if (!selectedRole) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelection} />;
  }

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
            {selectedRole === "farmer" ? (
              <>
                <p className="text-xs mb-2">
                  👩‍🌾 Você é uma camponesa! Plante e colha tulipas, depois venda pelo melhor preço!
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  🎯 Objetivo: Acumular {WINNING_COINS} florins antes do dia {CRASH_DAY}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  💡 Dica: Plante no campo à esquerda e venda quando o preço estiver alto!
                </p>
              </>
            ) : (
              <>
                <p className="text-xs mb-2">
                  🧔‍♂️ Você é um mercador! Compre tulipas de fazendeiros e venda para clientes!
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  🎯 Objetivo: Acumular {WINNING_COINS} florins antes do dia {CRASH_DAY}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  ⚠️ Custos diários: {SHOP_COST} florins (loja) + {STORAGE_COST_PER_TULIP} florins/tulipa (armazenagem)
                </p>
              </>
            )}
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-xs underline hover:no-underline"
            >
              Entendi!
            </button>
          </div>
        )}

        {/* News Panel */}
        <NewsPanel newsEvent={newsEvent} />

        {/* Stats */}
        <GameStats 
          coins={coins} 
          day={day} 
          stock={stock}
          reputation={reputation}
          marketPrice={currentPrice}
          hype={hype}
          priceChange={priceHistory.length > 1 ? currentPrice - priceHistory[priceHistory.length - 2] : 0}
        />

        {/* Main Game Area */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left: Farming or Risk Controls */}
          <div className="space-y-4">
            {selectedRole === "farmer" ? (
              <>
                <GameField
                  onHarvest={handleHarvest}
                  coins={coins}
                  onSpendCoins={handleSpendCoins}
                />
                <MarketPanel
                  currentPrice={currentPrice}
                  tulipsInInventory={stock}
                  onSell={handleSell}
                  day={day}
                  priceHistory={priceHistory}
                />
              </>
            ) : (
              <>
                <GameField
                  onHarvest={handleHarvest}
                  coins={coins}
                  onSpendCoins={handleSpendCoins}
                />
                <RiskControls
                  onHoldStock={handleHoldStock}
                  onFlashSale={handleFlashSale}
                  canHoldStock={coins >= HOLD_STOCK_COST}
                  canFlashSale={stock > 0}
                  isFlashSaleActive={isFlashSaleActive}
                />
              </>
            )}
          </div>
          
          {/* Center: Offers (Merchant only) or Market (Farmer) */}
          <div>
            {selectedRole === "merchant" ? (
              <OffersList
                offers={offers}
                onAccept={handleAcceptOffer}
                onReject={handleRejectOffer}
              />
            ) : (
              <div className="pixel-border bg-card p-6 text-center space-y-4">
                <h3 className="text-lg font-semibold">📊 Mercado</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe os preços e venda suas tulipas no momento certo!
                </p>
                <div className="text-2xl">
                  Preço atual: <span className="text-primary font-bold">{currentPrice}₣</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Market (Merchant) or Tips (Farmer) */}
          <div className="space-y-4">
            {selectedRole === "merchant" ? (
              <>
                <PricingControls
                  bidPrice={bidPrice}
                  askPrice={askPrice}
                  marketPrice={currentPrice}
                  onBidChange={setBidPrice}
                  onAskChange={setAskPrice}
                />
                <MarketPanel
                  currentPrice={currentPrice}
                  tulipsInInventory={stock}
                  onSell={handleSell}
                  day={day}
                  priceHistory={priceHistory}
                />
              </>
            ) : (
              <div className="pixel-border bg-card p-6 space-y-4">
                <h3 className="text-lg font-semibold">💡 Dicas</h3>
                <div className="space-y-2 text-sm">
                  <p>🌱 Plante tulipas no campo</p>
                  <p>⏱️ Espere crescerem (barra de progresso)</p>
                  <p>💰 Venda quando o preço estiver alto</p>
                  <p>⚠️ Cuidado: o mercado pode colapsar!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Educational Tips */}
        <div className="pixel-border bg-muted/30 p-4 text-center">
          <p className="text-xs">
            {selectedRole === "farmer" ? (
              <>
                {day < 10 && "💡 Plante regularmente e venda quando o preço subir."}
                {day >= 10 && day < 15 && "📈 Os preços estão subindo! Considere guardar estoque."}
                {day >= 15 && day < 20 && "⚖️ Nem todo crescimento é sustentável - esteja pronto para vender!"}
                {day >= 20 && day < 25 && "🤔 O mercado está instável... talvez seja hora de vender tudo."}
                {day >= 25 && "⚠️ A ganância pode custar caro... venda enquanto há tempo!"}
              </>
            ) : (
              <>
                {day < 10 && "💡 Spread alto reduz volume; spread baixo aumenta risco."}
                {day >= 10 && day < 15 && "💡 Compre barato de fazendeiros, venda caro para clientes."}
                {day >= 15 && day < 20 && "⚖️ Nem todo crescimento é sustentável - gerencie seu estoque!"}
                {day >= 20 && day < 25 && "🤔 Reputação afeta o número de ofertas que você recebe."}
                {day >= 25 && "⚠️ A ganância pode custar caro... considere vender tudo!"}
              </>
            )}
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
