/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { useState, useEffect } from "react";

interface TulipSlot {
  id: number;
  state: "empty" | "growing" | "ready";
  growthProgress: number;
}

interface GameFieldProps {
  onHarvest: (count: number) => void;
  coins: number;
  onSpendCoins: (amount: number) => void;
}

const PLANT_COST = 10;
const GROWTH_TIME = 5000; // 5 seconds

export const GameField = ({ onHarvest, coins, onSpendCoins }: GameFieldProps) => {
  const [slots, setSlots] = useState<TulipSlot[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      state: "empty",
      growthProgress: 0,
    }))
  );

  const plantTulip = (slotId: number) => {
    if (coins < PLANT_COST) return;
    
    const slot = slots.find(s => s.id === slotId);
    if (slot?.state !== "empty") return;

    onSpendCoins(PLANT_COST);
    
    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, state: "growing" as const, growthProgress: 0 }
        : s
    ));
  };

  const harvestSlot = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot?.state !== "ready") return;

    onHarvest(1);
    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, state: "empty" as const, growthProgress: 0 }
        : s
    ));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => prev.map(slot => {
        if (slot.state === "growing") {
          const newProgress = slot.growthProgress + (100 / (GROWTH_TIME / 100));
          if (newProgress >= 100) {
            return { ...slot, state: "ready" as const, growthProgress: 100 };
          }
          return { ...slot, growthProgress: newProgress };
        }
        return slot;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl mb-4 text-center">🌷 Your Tulip Field</h2>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="tulip-slot cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              if (slot.state === "empty") plantTulip(slot.id);
              else if (slot.state === "ready") harvestSlot(slot.id);
            }}
          >
            {slot.state === "empty" && (
              <div className="h-full flex items-center justify-center text-4xl opacity-50">
                +
              </div>
            )}
            
            {slot.state === "growing" && (
              <div className="h-full flex flex-col items-center justify-end p-2">
                <div className="text-3xl mb-2 animate-grow">🌱</div>
                <div className="w-full bg-muted h-2 pixel-border">
                  <div 
                    className="h-full bg-secondary transition-all duration-100"
                    style={{ width: `${slot.growthProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {slot.state === "ready" && (
              <div className="h-full flex items-center justify-center">
                <div className="text-4xl animate-pulse">🌷</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center mt-4 text-xs">
        💰 Plant: {PLANT_COST} coins | ⏱️ Growth: 5s
      </p>
    </div>
  );
};
