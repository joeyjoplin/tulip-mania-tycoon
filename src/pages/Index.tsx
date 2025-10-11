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
    const clientNames = ["Burgomaster", "Wealthy Merchant", "Noble", "Banker"];
    
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

  // Day advancement with daily costs and decay (only for merchant)
  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay(prev => {
        const newDay = prev + 1;
        
        // Apply daily costs only for merchant
        if (selectedRole === "merchant") {
          const storageCost = stock * STORAGE_COST_PER_TULIP;
          const totalDailyCost = SHOP_COST + storageCost;
          setCoins(c => Math.max(0, c - totalDailyCost));
          
          // Apply stock decay (8% or 4% if protected)
          const decayRate = stockProtected ? 0.04 : DAILY_DECAY;
          setStock(s => Math.floor(s * (1 - decayRate)));
          setStockProtected(false); // Protection lasts only one day
          setIsFlashSaleActive(false); // Flash sale lasts only one day
        }
        
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
        
        // Generate new offers only for merchant
        if (selectedRole === "merchant" && Math.random() > 0.3) { // 70% chance to generate offer
          setOffers(prev => [...prev, generateOffer()]);
        }
        
        // Market events
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
        
        if (newDay === 15) {
          toast.warning("⚠️ The market is very volatile...", {
            description: "Can this continue?"
          });
        }
        
        if (newDay === 25) {
          toast.error("🔴 Signs of panic in the market!", {
            description: "Some investors are selling everything..."
          });
        }
        
        return newDay;
      });
    }, 8000); // Advance day every 8 seconds

    return () => clearInterval(dayInterval);
  }, [stock, stockProtected, hype, coins, reputation, selectedRole]);

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
      toast.success("🎉 You won!", {
        description: `Accumulated ${coins} florins before the crash!`
      });
    }
  }, [coins, gameOver, day]);

  // Handle accepting an offer (merchant only)
  const handleAcceptOffer = (offer: Offer) => {
    if (selectedRole !== "merchant") return;
    
    if (offer.type === "farmer") {
      // Buy from farmer
      const totalCost = offer.price * offer.quantity;
      if (coins >= totalCost) {
        setCoins(c => c - totalCost);
        setStock(s => s + offer.quantity);
        setReputation(r => Math.min(100, r + 2)); // Good deal increases reputation
        toast.success(`✅ Bought ${offer.quantity} tulips from ${offer.name}!`, {
          description: `Cost: ${totalCost} florins`
        });
      } else {
        toast.error("💸 Insufficient florins!");
        setReputation(r => Math.max(0, r - 5)); // Rejecting due to lack of funds hurts reputation
      }
    } else {
      // Sell to client
      if (stock >= offer.quantity) {
        const earnings = offer.price * offer.quantity;
        setCoins(c => c + earnings);
        setStock(s => s - offer.quantity);
        setReputation(r => Math.min(100, r + 3)); // Good sale increases reputation more
        toast.success(`✅ Sold ${offer.quantity} tulips to ${offer.name}!`, {
          description: `Earned: ${earnings} florins`
        });
      } else {
        toast.error("🌷 Insufficient stock!");
        setReputation(r => Math.max(0, r - 5)); // Can't fulfill order hurts reputation
      }
    }
    // Remove the offer
    setOffers(prev => prev.filter(o => o.id !== offer.id));
  };

  // Handle rejecting an offer (merchant only)
  const handleRejectOffer = (offerId: string) => {
    if (selectedRole !== "merchant") return;
    setOffers(prev => prev.filter(o => o.id !== offerId));
    setReputation(r => Math.max(0, r - 1)); // Small reputation penalty
  };

  // Risk management: Hold Stock (merchant only)
  const handleHoldStock = () => {
    if (selectedRole !== "merchant") return;
    if (coins >= HOLD_STOCK_COST) {
      setCoins(c => c - HOLD_STOCK_COST);
      setStockProtected(true);
      toast.success("🛡️ Stock protected!", {
        description: "Decay reduced to 4% for 1 day"
      });
    } else {
      toast.error("💸 Insufficient florins!");
    }
  };

  // Risk management: Flash Sale (merchant only)
  const handleFlashSale = () => {
    if (selectedRole !== "merchant") return;
    if (stock > 0 && !isFlashSaleActive) {
      setIsFlashSaleActive(true);
      setAskPrice(Math.floor(askPrice * 0.8)); // 20% discount
      toast.success("⚡ Sale activated!", {
        description: "Sell price reduced for 1 day"
      });
    } else if (stock === 0) {
      toast.error("🌷 No stock for sale!");
    }
  };

  // Farming mechanics (farmer only)
  const handleHarvest = (count: number) => {
    if (selectedRole !== "farmer") return;
    setStock(prev => prev + count);
    toast.success("🌷 Tulip harvested!", {
      description: "Added to stock!"
    });
  };

  const handleSpendCoins = (amount: number) => {
    if (selectedRole !== "farmer") return;
    setCoins(prev => prev - amount);
  };

  // Sell all stock (farmer sells directly at market price)
  const handleSell = () => {
    if (stock === 0) {
      toast.error("🌷 No tulips in stock!");
      return;
    }
    
    const sellPrice = selectedRole === "farmer" ? currentPrice : askPrice;
    const earnings = stock * sellPrice;
    setCoins(prev => prev + earnings);
    setStock(0);
    toast.success(`💰 Sold all stock!`, {
      description: `Earned ${earnings} florins`
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
          <h1 className="text-4xl md:text-5xl mb-2">🌷 Tulips Game</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Holland, 17th century - The Tulipmania era
          </p>
        </header>

        {/* Tutorial Toast */}
        {showTutorial && (
          <div className="pixel-border bg-primary/10 p-4 text-center animate-fade-in">
            {selectedRole === "farmer" ? (
              <>
                <p className="text-xs mb-2">
                  👩‍🌾 You're a farmer! Plant and harvest tulips, then sell at the best price!
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  🎯 Goal: Accumulate {WINNING_COINS} florins before day {CRASH_DAY}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  💡 Tip: Plant in the left field and sell when the price is high!
                </p>
              </>
            ) : (
              <>
                <p className="text-xs mb-2">
                  🧔‍♂️ You're a merchant! Buy tulips from farmers and sell to clients!
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  🎯 Goal: Accumulate {WINNING_COINS} florins before day {CRASH_DAY}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  ⚠️ Daily costs: {SHOP_COST} florins (shop) + {STORAGE_COST_PER_TULIP} florins/tulip (storage)
                </p>
              </>
            )}
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-xs underline hover:no-underline"
            >
              Got it!
            </button>
          </div>
        )}

        {/* News Panel */}
        <NewsPanel newsEvent={newsEvent} />

        {/* Stats - Show different stats based on role */}
        <GameStats 
          coins={coins} 
          day={day} 
          stock={stock}
          reputation={selectedRole === "merchant" ? reputation : undefined}
          marketPrice={currentPrice}
          hype={hype}
          priceChange={priceHistory.length > 1 ? currentPrice - priceHistory[priceHistory.length - 2] : 0}
        />

        {/* Main Game Area */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {selectedRole === "farmer" ? (
              <>
                {/* Farmer: Planting field */}
                <GameField
                  onHarvest={handleHarvest}
                  coins={coins}
                  onSpendCoins={handleSpendCoins}
                />
              </>
            ) : (
              <>
                {/* Merchant: Risk controls */}
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
          
          {/* Center Column */}
          <div>
            {selectedRole === "merchant" ? (
              <>
                {/* Merchant: Offers list */}
                <OffersList
                  offers={offers}
                  onAccept={handleAcceptOffer}
                  onReject={handleRejectOffer}
                />
              </>
            ) : (
              <>
                {/* Farmer: Market info */}
                <div className="pixel-border bg-card p-6 space-y-4">
                  <h3 className="text-lg font-semibold">📊 Market Panel</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current price:</span>
                      <span className="text-2xl font-bold text-primary">{currentPrice}₣</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Your stock:</span>
                      <span className="text-xl font-semibold">{stock} 🌷</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total value:</span>
                      <span className="text-xl font-semibold text-green-600">{stock * currentPrice}₣</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {selectedRole === "merchant" ? (
              <>
                {/* Merchant: Pricing controls and market panel */}
                <PricingControls
                  bidPrice={bidPrice}
                  askPrice={askPrice}
                  marketPrice={currentPrice}
                  onBidChange={setBidPrice}
                  onAskChange={setAskPrice}
                />
              </>
            ) : null}
            
            {/* Market panel for both roles */}
            <MarketPanel
              currentPrice={currentPrice}
              tulipsInInventory={stock}
              onSell={handleSell}
              day={day}
              priceHistory={priceHistory}
            />
          </div>
        </div>

        {/* Educational Tips */}
        <div className="pixel-border bg-muted/30 p-4 text-center">
          <p className="text-xs">
            {selectedRole === "farmer" ? (
              <>
                {day < 10 && "💡 Plant regularly and sell when the price rises."}
                {day >= 10 && day < 15 && "📈 Prices are rising! Consider holding stock."}
                {day >= 15 && day < 20 && "⚖️ Not all growth is sustainable - be ready to sell!"}
                {day >= 20 && day < 25 && "🤔 The market is unstable... maybe it's time to sell everything."}
                {day >= 25 && "⚠️ Greed can be costly... sell while there's time!"}
              </>
            ) : (
              <>
                {day < 10 && "💡 High spread reduces volume; low spread increases risk."}
                {day >= 10 && day < 15 && "💡 Buy cheap from farmers, sell high to clients."}
                {day >= 15 && day < 20 && "⚖️ Not all growth is sustainable - manage your stock!"}
                {day >= 20 && day < 25 && "🤔 Reputation affects the number of offers you receive."}
                {day >= 25 && "⚠️ Greed can be costly... consider selling everything!"}
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground">
          <p>An educational game about the 1637 tulip bubble</p>
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
