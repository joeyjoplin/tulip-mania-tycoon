/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { useState, useEffect } from "react";

interface TulipSlot {
  id: number;
  state: "empty" | "growing" | "ready";
  growthProgress: number; // 0–100
}

interface GameFieldProps {
  /** Called when one bloom is harvested (increments global stock by count). */
  onHarvest: (count: number) => void;

  /** Current player coins, used to validate planting cost. */
  coins: number;

  /** Charges the player when planting a tulip. */
  onSpendCoins: (amount: number) => void;
}

/** Planting cost and growth timing */
const PLANT_COST = 10;
const GROWTH_TIME_MS = 5000; // 5 seconds total
const TICK_MS = 100;         // growth update cadence
const SLOTS_COUNT = 12;      // 12 plots (2x6 mobile, 3x4 desktop)

export const GameField = ({ onHarvest, coins, onSpendCoins }: GameFieldProps) => {
  /** 
   * Randomly seeds the field:
   * ~40% of plots start as "growing" with 20–80% progress
   * others remain empty for the player to plant.
   */
  const createInitialSlots = (): TulipSlot[] => {
    return Array.from({ length: SLOTS_COUNT }, (_, i) => {
      const isGrowing = Math.random() < 0.4;
      const randomProgress = Math.floor(20 + Math.random() * 60);
      return {
        id: i,
        state: isGrowing ? "growing" : "empty",
        growthProgress: isGrowing ? randomProgress : 0,
      };
    });
  };

  const [slots, setSlots] = useState<TulipSlot[]>(createInitialSlots);

  /** Start planting on an empty slot (charges coins if enough balance). */
  const plantTulip = (slotId: number) => {
    if (coins < PLANT_COST) return; // not enough coins
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.state !== "empty") return;

    onSpendCoins(PLANT_COST);
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, state: "growing", growthProgress: 0 } : s
      )
    );
  };

  /** Harvest a ready bloom, reset slot to empty, and notify parent. */
  const harvestSlot = (slotId: number) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.state !== "ready") return;

    onHarvest(1);
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, state: "empty", growthProgress: 0 } : s
      )
    );
  };

  /** Auto-growth loop: advances progress for all growing slots. */
  useEffect(() => {
    const increment = 100 / (GROWTH_TIME_MS / TICK_MS); // e.g. +2% per tick
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => {
          if (slot.state !== "growing") return slot;
          const nextProgress = slot.growthProgress + increment;
          if (nextProgress >= 100) {
            return { ...slot, state: "ready", growthProgress: 100 };
          }
          return { ...slot, growthProgress: nextProgress };
        })
      );
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl mb-4 text-center">🌷 Your Tulip Field</h2>

      {/* Responsive grid: 2 columns on mobile (2x6) and 3 columns on desktop (3x4) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-lg mx-auto">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="tulip-slot cursor-pointer hover:scale-[1.02] transition-transform pixel-border bg-card/40 h-28 sm:h-32 flex items-center justify-center p-2"
            onClick={() => {
              if (slot.state === "empty") plantTulip(slot.id);
              else if (slot.state === "ready") harvestSlot(slot.id);
            }}
            aria-label={`Plot ${slot.id + 1}: ${slot.state}`}
            title={
              slot.state === "empty"
                ? `Click to plant (-${PLANT_COST} coins)`
                : slot.state === "growing"
                ? `Growing… ${Math.floor(slot.growthProgress)}%`
                : "Ready! Click to harvest"
            }
          >
            {slot.state === "empty" && (
              <div className="h-full w-full flex flex-col items-center justify-center opacity-60">
                <div className="text-3xl leading-none">＋</div>
                <div className="text-[10px] sm:text-xs mt-1">Plant ({PLANT_COST}₣)</div>
              </div>
            )}

            {slot.state === "growing" && (
              <div className="h-full w-full flex flex-col items-center justify-end">
                <div className="text-3xl mb-2">🌱</div>
                <div className="w-full bg-muted h-2 pixel-border">
                  <div
                    className="h-full bg-secondary transition-all duration-100"
                    style={{ width: `${slot.growthProgress}%` }}
                  />
                </div>
              </div>
            )}

            {slot.state === "ready" && (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-4xl animate-pulse">🌷</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center mt-4 text-xs text-muted-foreground">
        💰 Plant cost: {PLANT_COST}₣ · ⏱️ Growth time: 5 s
      </p>
    </div>
  );
};


