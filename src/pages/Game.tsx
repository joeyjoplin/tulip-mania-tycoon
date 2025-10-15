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
const INITIAL_COINS = 1000;
const INITIAL_PRICE = 20;
const WINNING_COINS = 5000;
const CRASH_DAY = 30;
const DAILY_DECAY = 0.08;
const SHOP_COST = 30;
const STORAGE_COST_PER_TULIP = 2;
const HOLD_STOCK_COST = 50;
const SURVIVAL_REPUTATION = 60;

const Game = () => {
  const [selectedRole, setSelectedRole] = useState<GameRole | null>(null);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [day, setDay] = useState(1);
  const [stock, setStock] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [priceHistory, setPriceHistory] = useState<number[]>([INITIAL_PRICE]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [reputation, setReputation] = useState(100);
  const [hype, setHype] = useState(50);
  const [bidPrice, setBidPrice] = useState(INITIAL_PRICE);
  const [askPrice, setAskPrice] = useState(INITIAL_PRICE + 5);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newsEvent, setNewsEvent] = useState("");
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);
  const [stockProtected, setStockProtected] = useState(false);

  const calculatePrice = (currentDay: number, currentHype: number): number => {
    if (currentDay >= CRASH_DAY) {
      return Math.floor(INITIAL_PRICE * 0.1);
    }
    const hypeMultiplier = 1 + (currentHype / 100);
    if (currentDay < 15) {
      return Math.floor(INITIAL_PRICE * (1 + currentDay * 0.3) * hypeMultiplier);
    } else if (currentDay < 25) {
      const base = INITIAL_PRICE * 5;
      const volatility = Math.sin(currentDay) * 20;
      return Math.floor((base + volatility) * hypeMultiplier);
    } else {
      const daysTowardsEnd = currentDay - 25;
      return Math.floor(INITIAL_PRICE * 5 * (1 - daysTowardsEnd * 0.15) * hypeMultiplier);
    }
  };

  const generateOffer = (): Offer => {
    const isFarmer = Math.random() > 0.5;
    const farmerNames = ["Hans", "Pieter", "Jan", "Willem", "Dirk"];
    const clientNames = ["Burgomaster", "Wealthy Merchant", "Noble", "Banker"];
    
    if (isFarmer) {
      return {
        id: `farmer-${Date.now()}-${Math.random()}`,
        type: "farmer",
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(currentPrice * (0.7 + Math.random() * 0.3)),
        name: farmerNames[Math.floor(Math.random() * farmerNames.length)]
      };
    } else {
      return {
        id: `client-${Date.now()}-${Math.random()}`,
        type: "client",
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(currentPrice * (1.1 + Math.random() * 0.4)),
        name: clientNames[Math.floor(Math.random() * clientNames.length)]
      };
    }
  };

  const generateNewsEvent = (currentDay: number, currentHype: number): string => {
    if (currentDay >= 25) {
      const panicNews = [
        "💥 Collapse rumors are spreading!",
        "😰 Panicked investors start selling!",
        "📉 Signs of market saturation!"
      ];
      return panicNews[Math.floor(Math.random() * panicNews.length)];
    } else if (currentDay >= 20) {
      return "⚠️ Analysts question price sustainability";
    } else if (currentDay >= 15) {
      const hypeNews = [
        "🔥 Tulipmania reaches new peak!",
        "💰 Fortunes being made with tulips!",
        "✨ Nobility pays fortunes for rare tulips!"
      ];
      return hypeNews[Math.floor(Math.random() * hypeNews.length)];
    } else if (currentHype > 70) {
      return "📈 Tulip demand grows exponentially!";
    }
    return "";
  };

  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        
        if (selectedRole === "merchant") {
          const storageCost = stock * STORAGE_COST_PER_TULIP;
          const totalDailyCost = SHOP_COST + storageCost;
          setCoins(c => Math.max(0, c - totalDailyCost));
          
          const decayRate = stockProtected ? 0.04 : DAILY_DECAY;
          setStock(s => Math.floor(s * (1 - decayRate)));
          setStockProtected(false);
          setIsFlashSaleActive(false);
        }
        
        if (newDay < 15) {
          setHype(h => Math.min(100, h + 5));
        } else if (newDay >= 25) {
          setHype(h => Math.max(0, h - 10));
        } else {
          setHype(h => Math.max(0, h - 2));
        }
        
        const news = generateNewsEvent(newDay, hype);
        if (news) {
          setNewsEvent(news);
          setTimeout(() => setNewsEvent(""), 6000);
        }
        
        if (selectedRole === "merchant" && Math.random() > 0.3) {
          setOffers(prev => [...prev, generateOffer()]);
        }
        
        if (newDay === CRASH_DAY) {
          setGameOver(true);
          const survived = selectedRole === "merchant" 
            ? coins >= 0 && reputation >= SURVIVAL_REPUTATION 
            : coins >= 0;
          setIsWin(survived);
          toast.error("💥 The market collapsed!", {
            description: survived ? "But you survived!" : "Tulips are now worth almost nothing..."
          });
        }
        
        return newDay;
      });
    }, 8000);

    return () => clearInterval(dayInterval);
  }, [stock, stockProtected, hype, coins, reputation, selectedRole]);

  useEffect(() => {
    const newPrice = calculatePrice(day, hype);
    setCurrentPrice(newPrice);
    setPriceHistory(prev => [...prev, newPrice]);
    setBidPrice(Math.floor(newPrice * 0.9));
    setAskPrice(Math.floor(newPrice * 1.1));
  }, [day, hype]);

  useEffect(() => {
    if (coins >= WINNING_COINS && !gameOver && day < CRASH_DAY) {
      setGameOver(true);
      setIsWin(true);
      toast.success("🎉 You won!", {
        description: `Accumulated ${coins} florins before the crash!`
      });
    }
  }, [coins, gameOver, day]);

  const handleAcceptOffer = (offer: Offer) => {
    if (selectedRole !== "merchant") return;
    
    if (offer.type === "farmer") {
      const totalCost = offer.price * offer.quantity;
      if (coins >= totalCost) {
        setCoins(c => c - totalCost);
        setStock(s => s + offer.quantity);
        setReputation(r => Math.min(100, r + 2));
        toast.success(`✅ Bought ${offer.quantity} tulips from ${offer.name}!`);
      } else {
        toast.error("💸 Insufficient florins!");
        setReputation(r => Math.max(0, r - 5));
      }
    } else {
      if (stock >= offer.quantity) {
        const earnings = offer.price * offer.quantity;
        setCoins(c => c + earnings);
        setStock(s => s - offer.quantity);
        setReputation(r => Math.min(100, r + 3));
        toast.success(`✅ Sold ${offer.quantity} tulips to ${offer.name}!`);
      } else {
        toast.error("🌷 Insufficient stock!");
        setReputation(r => Math.max(0, r - 5));
      }
    }
    setOffers(prev => prev.filter(o => o.id !== offer.id));
  };

  const handleRejectOffer = (offerId: string) => {
    if (selectedRole !== "merchant") return;
    setOffers(prev => prev.filter(o => o.id !== offerId));
    setReputation(r => Math.max(0, r - 1));
  };

  const handleHoldStock = () => {
    if (selectedRole !== "merchant") return;
    if (coins >= HOLD_STOCK_COST) {
      setCoins(c => c - HOLD_STOCK_COST);
      setStockProtected(true);
      toast.success("🛡️ Stock protected!");
    } else {
      toast.error("💸 Insufficient florins!");
    }
  };

  const handleFlashSale = () => {
    if (selectedRole !== "merchant") return;
    if (stock > 0 && !isFlashSaleActive) {
      setIsFlashSaleActive(true);
      setAskPrice(Math.floor(askPrice * 0.8));
      toast.success("⚡ Sale activated!");
    } else if (stock === 0) {
      toast.error("🌷 No stock for sale!");
    }
  };

  const handleHarvest = (count: number) => {
    if (selectedRole !== "farmer") return;
    setStock(prev => prev + count);
    toast.success("🌷 Tulip harvested!");
  };

  const handleSpendCoins = (amount: number) => {
    if (selectedRole !== "farmer") return;
    setCoins(prev => prev - amount);
  };

  const handleSell = () => {
    if (stock === 0) {
      toast.error("🌷 No tulips in stock!");
      return;
    }
    const sellPrice = selectedRole === "farmer" ? currentPrice : askPrice;
    const earnings = stock * sellPrice;
    setCoins(prev => prev + earnings);
    setStock(0);
    toast.success(`💰 Sold all stock!`);
  };

  const handleRestart = () => {
    setSelectedRole(null);
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

  if (!selectedRole) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelection} />;
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        <header className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-2">🌷 Tulips Game</h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            Holland, 17th century - The Tulipmania era
          </p>
        </header>

        {showTutorial && (
          <div className="pixel-border bg-primary/10 p-3 sm:p-4 text-center animate-fade-in">
            {selectedRole === "farmer" ? (
              <>
                <p className="text-[10px] sm:text-xs mb-2">
                  👩‍🌾 You're a farmer! Plant and harvest tulips, then sell at the best price!
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                  🎯 Goal: Accumulate {WINNING_COINS} florins before day {CRASH_DAY}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] sm:text-xs mb-2">
                  🧔‍♂️ You're a merchant! Buy tulips from farmers and sell to clients!
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                  🎯 Goal: Accumulate {WINNING_COINS} florins before day {CRASH_DAY}
                </p>
              </>
            )}
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-[10px] sm:text-xs underline hover:no-underline"
            >
              Got it!
            </button>
          </div>
        )}

        <NewsPanel newsEvent={newsEvent} />

        <GameStats 
          coins={coins} 
          day={day} 
          stock={stock}
          reputation={selectedRole === "merchant" ? reputation : undefined}
          marketPrice={currentPrice}
          hype={hype}
          priceChange={priceHistory.length > 1 ? currentPrice - priceHistory[priceHistory.length - 2] : 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-3 sm:space-y-4">
            {selectedRole === "farmer" ? (
              <GameField
                onHarvest={handleHarvest}
                coins={coins}
                onSpendCoins={handleSpendCoins}
              />
            ) : (
              <RiskControls
                onHoldStock={handleHoldStock}
                onFlashSale={handleFlashSale}
                canHoldStock={coins >= HOLD_STOCK_COST}
                canFlashSale={stock > 0}
                isFlashSaleActive={isFlashSaleActive}
              />
            )}
          </div>
          
          <div>
            {selectedRole === "merchant" ? (
              <OffersList
                offers={offers}
                onAccept={handleAcceptOffer}
                onReject={handleRejectOffer}
              />
            ) : (
              <div className="pixel-border bg-card p-6 space-y-4">
                <h3 className="text-lg font-semibold">📊 Market Panel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current price:</span>
                    <span className="text-2xl font-bold text-primary">{currentPrice}₣</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {selectedRole === "merchant" ? (
            <PricingControls
              marketPrice={currentPrice}
              bidPrice={bidPrice}
              askPrice={askPrice}
              onBidChange={setBidPrice}
              onAskChange={setAskPrice}
            />
            ) : null}
            
            <MarketPanel
              currentPrice={currentPrice}
              tulipsInInventory={stock}
              onSell={handleSell}
              day={day}
              priceHistory={priceHistory}
            />
          </div>
        </div>
      </div>

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

export default Game;
