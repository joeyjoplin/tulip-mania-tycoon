/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { useState, useEffect } from "react";
import { GameField } from "@/components/GameField";
import { GameStats } from "@/components/GameStats";
import { GameOverModal } from "@/components/GameOverModal";
import { PricingControls } from "@/components/PricingControls";
import { OffersList, Offer } from "@/components/OffersList";
import { NewsPanel } from "@/components/NewsPanel";
import { RiskControls } from "@/components/RiskControls";
import { RoleSelectionScreen, GameRole } from "@/components/RoleSelectionScreen";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

// ------------------------------------------------------------
// GAME CONSTANTS
// ------------------------------------------------------------
const INITIAL_COINS = 1000;
const INITIAL_PRICE = 20;
const WINNING_COINS = 5000;
const CRASH_DAY = 30;                 // legacy fixed crash
const DAILY_DECAY = 0.08;
const SHOP_COST = 30;
const STORAGE_COST_PER_TULIP = 2;
const HOLD_STOCK_COST = 50;
const SURVIVAL_REPUTATION = 60;

// ------------------------------------------------------------
// EARLY-CRASH TUNING (higher challenge)
// ------------------------------------------------------------
// Crash checks begin after this day (inclusive)
const EARLY_CRASH_START_DAY = 18;

// Base probability at start day
const EARLY_CRASH_BASE = 0.02; // 2%

// Probability added per day after start
const EARLY_CRASH_PER_DAY = 0.006; // +0.6%/day

// Additional boost when panic zone (>=25)
const EARLY_CRASH_PANIC_BONUS = 0.05; // +5%

// Maximum daily probability cap
const EARLY_CRASH_MAX = 0.30; // 30% cap

// Hype multiplier range: low hype ~0.8x, high hype ~1.4x
const hypeMultiplier = (h: number) => 0.8 + (h / 100) * 0.6;

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
const Game = () => {
  // ------------------------------------------------------------
  // STATE MANAGEMENT
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // PRICE LOGIC
  // ------------------------------------------------------------
  const calculatePrice = (currentDay: number, currentHype: number): number => {
    if (currentDay >= CRASH_DAY) {
      return Math.floor(INITIAL_PRICE * 0.1);
    }
    const hypeMult = 1 + currentHype / 100;
    if (currentDay < 15) {
      return Math.floor(INITIAL_PRICE * (1 + currentDay * 0.3) * hypeMult);
    } else if (currentDay < 25) {
      const base = INITIAL_PRICE * 5;
      const volatility = Math.sin(currentDay) * 20;
      return Math.floor((base + volatility) * hypeMult);
    } else {
      const daysTowardsEnd = currentDay - 25;
      return Math.floor(INITIAL_PRICE * 5 * (1 - daysTowardsEnd * 0.15) * hypeMult);
    }
  };

  // ------------------------------------------------------------
  // OFFER GENERATION (for Merchant)
  // ------------------------------------------------------------
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
        name: farmerNames[Math.floor(Math.random() * farmerNames.length)],
      };
    } else {
      return {
        id: `client-${Date.now()}-${Math.random()}`,
        type: "client",
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(currentPrice * (1.1 + Math.random() * 0.4)),
        name: clientNames[Math.floor(Math.random() * clientNames.length)],
      };
    }
  };

  // ------------------------------------------------------------
  // NEWS EVENTS
  // ------------------------------------------------------------
  const generateNewsEvent = (currentDay: number, currentHype: number): string => {
    if (currentDay >= 25) {
      const panicNews = [
        "💥 Collapse rumors are spreading!",
        "😰 Panic among investors!",
        "📉 Signs of market saturation!",
      ];
      return panicNews[Math.floor(Math.random() * panicNews.length)];
    } else if (currentDay >= 20) {
      return "⚠️ Analysts question price sustainability.";
    } else if (currentDay >= 15) {
      const hypeNews = [
        "🔥 Tulipmania reaches a new peak!",
        "💰 Fortunes are being made from tulips!",
        "✨ Nobles are paying fortunes for rare bulbs!",
      ];
      return hypeNews[Math.floor(Math.random() * hypeNews.length)];
    } else if (currentHype > 70) {
      return "📈 Tulip demand keeps growing!";
    }
    return "";
  };

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------
  const triggerCrashNow = (reason: "early" | "scheduled", newDay: number) => {
    if (gameOver) return;
    setGameOver(true);

    // Survival rule mirrors scheduled crash
    const survived =
      selectedRole === "merchant"
        ? coins >= 0 && reputation >= SURVIVAL_REPUTATION
        : coins >= 0;

    setIsWin(survived);

    toast.error(
      reason === "early" ? "💥 Early market collapse!" : "💥 The market collapsed!",
      {
        description:
          reason === "early"
            ? survived
              ? "Shock crash hit the market, but you survived."
              : "A sudden panic wiped out the market value."
            : survived
            ? "But you survived!"
            : "Tulips lost all value!",
      }
    );

    // Optional: nudge day to CRASH_DAY so price calc shows post-crash value on next tick
    if (newDay < CRASH_DAY) {
      setDay(CRASH_DAY);
    }
  };

  // ------------------------------------------------------------
  // GAME LOOP (DAILY EVENTS + EARLY CRASH CHECK)
  // ------------------------------------------------------------
  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay((prev) => {
        const newDay = prev + 1;

        // Merchant daily costs and stock decay
        if (selectedRole === "merchant") {
          const storageCost = stock * STORAGE_COST_PER_TULIP;
          const totalDailyCost = SHOP_COST + storageCost;
          setCoins((c) => Math.max(0, c - totalDailyCost));

          const decayRate = stockProtected ? 0.04 : DAILY_DECAY;
          setStock((s) => Math.floor(s * (1 - decayRate)));
          setStockProtected(false);
          setIsFlashSaleActive(false);
        }

        // Hype progression
        if (newDay < 15) {
          setHype((h) => Math.min(100, h + 5));
        } else if (newDay >= 25) {
          setHype((h) => Math.max(0, h - 10));
        } else {
          setHype((h) => Math.max(0, h - 2));
        }

        // News generation (for flavor & UI tension)
        const news = generateNewsEvent(newDay, hype);
        if (news) {
          setNewsEvent(news);
          setTimeout(() => setNewsEvent(""), 6000);
        }

        // Offer creation (Merchant)
        if (selectedRole === "merchant" && Math.random() > 0.3) {
          setOffers((prev) => [...prev, generateOffer()]);
        }

        // ---------- EARLY CRASH CHECK ----------
        if (!gameOver && newDay >= EARLY_CRASH_START_DAY) {
          const daysSinceStart = newDay - EARLY_CRASH_START_DAY;
          let p =
            EARLY_CRASH_BASE +
            daysSinceStart * EARLY_CRASH_PER_DAY;

          // Panic-zone bonus
          if (newDay >= 25) p += EARLY_CRASH_PANIC_BONUS;

          // Scale by hype
          p *= hypeMultiplier(hype);

          // Cap probability
          p = Math.min(EARLY_CRASH_MAX, p);

          if (Math.random() < p) {
            triggerCrashNow("early", newDay);
            return newDay; // early stop; gameOver will be true
          }
        }

        // ---------- SCHEDULED CRASH ----------
        if (!gameOver && newDay === CRASH_DAY) {
          triggerCrashNow("scheduled", newDay);
        }

        return newDay;
      });
    }, 8000);

    return () => clearInterval(dayInterval);
  }, [stock, stockProtected, hype, coins, reputation, selectedRole, gameOver]);

  // ------------------------------------------------------------
  // PRICE UPDATE
  // ------------------------------------------------------------
  useEffect(() => {
    const newPrice = calculatePrice(day, hype);
    setCurrentPrice(newPrice);
    setPriceHistory((prev) => [...prev, newPrice]);
    setBidPrice(Math.floor(newPrice * 0.9));
    setAskPrice(Math.floor(newPrice * 1.1));
  }, [day, hype]);

  // ------------------------------------------------------------
  // WINNING CONDITION
  // ------------------------------------------------------------
  useEffect(() => {
    if (coins >= WINNING_COINS && !gameOver && day < CRASH_DAY) {
      setGameOver(true);
      setIsWin(true);
      toast.success("🎉 You won!", {
        description: `You accumulated ${coins} florins before the crash!`,
      });
    }
  }, [coins, gameOver, day]);

  // ------------------------------------------------------------
  // ACTION HANDLERS
  // ------------------------------------------------------------
  const handleAcceptOffer = (offer: Offer) => {
    if (selectedRole !== "merchant") return;

    if (offer.type === "farmer") {
      const totalCost = offer.price * offer.quantity;
      if (coins >= totalCost) {
        setCoins((c) => c - totalCost);
        setStock((s) => s + offer.quantity);
        setReputation((r) => Math.min(100, r + 2));
        toast.success(`✅ Bought ${offer.quantity} tulips from ${offer.name}!`);
      } else {
        toast.error("💸 Not enough florins!");
        setReputation((r) => Math.max(0, r - 5));
      }
    } else {
      if (stock >= offer.quantity) {
        const earnings = offer.price * offer.quantity;
        setCoins((c) => c + earnings);
        setStock((s) => s - offer.quantity);
        setReputation((r) => Math.min(100, r + 3));
        toast.success(`✅ Sold ${offer.quantity} tulips to ${offer.name}!`);
      } else {
        toast.error("🌷 Not enough stock!");
        setReputation((r) => Math.max(0, r - 5));
      }
    }
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
  };

  const handleRejectOffer = (offerId: string) => {
    if (selectedRole !== "merchant") return;
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    setReputation((r) => Math.max(0, r - 1));
  };

  const handleHoldStock = () => {
    if (selectedRole !== "merchant") return;
    if (coins >= HOLD_STOCK_COST) {
      setCoins((c) => c - HOLD_STOCK_COST);
      setStockProtected(true);
      toast.success("🛡️ Stock protected!");
    } else {
      toast.error("💸 Not enough florins!");
    }
  };

  const handleFlashSale = () => {
    if (selectedRole !== "merchant") return;
    if (stock > 0 && !isFlashSaleActive) {
      setIsFlashSaleActive(true);
      setAskPrice((p) => Math.floor(p * 0.8));
      toast.success("⚡ Flash sale activated!");
    } else if (stock === 0) {
      toast.error("🌷 No stock available!");
    }
  };

  /** Spend coins helper (used by Farmer when planting). */
  const handleSpendCoins = (amount: number) => {
    setCoins((prev) => Math.max(0, prev - amount));
  };

  /** Harvest callback from GameField → increments global stock. */
  const handleHarvest = (count: number) => {
    setStock((prev) => prev + count);
  };

  const handleSell = () => {
    if (stock === 0) {
      toast.error("🌷 No tulips to sell!");
      return;
    }
    const sellPrice = selectedRole === "farmer" ? currentPrice : askPrice;
    const earnings = stock * sellPrice;
    setCoins((prev) => prev + earnings);
    setStock(0);
    toast.success("💰 Sold all stock!");
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

  // ------------------------------------------------------------
  // FARMER ACTIONS PANEL (minimal; no clutter)
  // ------------------------------------------------------------
  const FarmerActionsCard = () => (
    <div className="pixel-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">👩‍🌾 Farmer Actions</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current price</span>
          <span className="text-2xl font-bold text-primary">{currentPrice}₣</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Tulips in stock</span>
          <span className="text-xl font-semibold">{stock}</span>
        </div>
        <button
          onClick={handleSell}
          className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          💰 Sell all stock
        </button>
        {showTutorial && (
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Watch the hype—higher hype raises early crash risk after day {EARLY_CRASH_START_DAY}.
          </p>
        )}
      </div>
    </div>
  );

  // ------------------------------------------------------------
  // MAIN RENDER
  // ------------------------------------------------------------
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <RoleSelectionScreen onSelectRole={handleRoleSelection} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Header */}
          <header className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-2">🌷 Tulips Game</h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              Holland, 17th century – The Tulipmania Era
            </p>
          </header>

          {/* News */}
          <NewsPanel newsEvent={newsEvent} />

          {/* Game Stats */}
          <GameStats
            coins={coins}
            day={day}
            stock={stock}
            reputation={selectedRole === "merchant" ? reputation : undefined}
            marketPrice={currentPrice}
            hype={hype}
            priceChange={priceHistory.length > 1 ? currentPrice - priceHistory[priceHistory.length - 2] : 0}
          />

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Column 1: Farmer field or Merchant RiskControls */}
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

            {/* Column 2: Merchant Offers (Farmer keeps a clean column) */}
            <div>
              {selectedRole === "merchant" ? (
                <OffersList
                  offers={offers}
                  onAccept={handleAcceptOffer}
                  onReject={handleRejectOffer}
                />
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            {/* Column 3: Merchant Pricing Controls or Farmer Summary */}
            <div className="space-y-3 sm:space-y-4">
              {selectedRole === "merchant" ? (
                <PricingControls
                  marketPrice={currentPrice}
                  bidPrice={bidPrice}
                  askPrice={askPrice}
                  onBidChange={setBidPrice}
                  onAskChange={setAskPrice}
                />
              ) : (
                <FarmerActionsCard />
              )}
            </div>
          </div>
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
      <Footer />
    </div>
  );
};

export default Game;




