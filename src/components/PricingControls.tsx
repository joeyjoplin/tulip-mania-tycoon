/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Info } from "lucide-react";

interface PricingControlsProps {
  bidPrice: number;
  askPrice: number;
  marketPrice: number;
  onBidChange: (price: number) => void;
  onAskChange: (price: number) => void;
}

export const PricingControls = ({
  bidPrice,
  askPrice,
  marketPrice,
  onBidChange,
  onAskChange,
}: PricingControlsProps) => {
  // Calculate spread and profit margin
  const spread = askPrice - bidPrice;
  const profitMargin = bidPrice > 0 ? ((spread / bidPrice) * 100).toFixed(1) : "0.0";
  
  // Helper to adjust price
  const adjustPrice = (current: number, delta: number, onChange: (n: number) => void) => {
    const newPrice = Math.max(1, current + delta);
    onChange(newPrice);
  };

  return (
    <div className="pixel-border bg-card/50 p-4 space-y-3">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-xs">⚖️ Buy/Sell Prices</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
              <Info className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 pixel-border bg-background/95 backdrop-blur-sm">
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm mb-2">Trading Terms Explained</h4>
              
              <div>
                <strong>Buy (Bid):</strong>
                <p className="text-muted-foreground">The price you pay to buy tulips from farmers. Lower bid = higher profit margin, but fewer farmers will sell to you.</p>
              </div>
              
              <div>
                <strong>Sell (Ask):</strong>
                <p className="text-muted-foreground">The price you charge clients to sell tulips. Higher ask = more profit, but fewer clients will buy from you.</p>
              </div>
              
              <div>
                <strong>Spread:</strong>
                <p className="text-muted-foreground">The difference between your sell and buy prices (Ask - Bid). This is your gross profit per tulip.</p>
              </div>
              
              <div>
                <strong>Margin:</strong>
                <p className="text-muted-foreground">Your profit as a percentage of the buy price. Higher margin means better profitability, but may reduce trade volume.</p>
              </div>
              
              <div>
                <strong>Index:</strong>
                <p className="text-muted-foreground">The current market reference price. Use this to gauge if your prices are competitive.</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Bid Price (Buy) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span>Buy (Bid):</span>
          <span className="font-bold text-green-400">{bidPrice} 💰</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => adjustPrice(bidPrice, -5, onBidChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            -5
          </Button>
          <Button
            onClick={() => adjustPrice(bidPrice, -1, onBidChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            -1
          </Button>
          <Button
            onClick={() => adjustPrice(bidPrice, 1, onBidChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            +1
          </Button>
          <Button
            onClick={() => adjustPrice(bidPrice, 5, onBidChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            +5
          </Button>
        </div>
      </div>

      {/* Ask Price (Sell) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span>Sell (Ask):</span>
          <span className="font-bold text-red-400">{askPrice} 💰</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => adjustPrice(askPrice, -5, onAskChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            -5
          </Button>
          <Button
            onClick={() => adjustPrice(askPrice, -1, onAskChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            -1
          </Button>
          <Button
            onClick={() => adjustPrice(askPrice, 1, onAskChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            +1
          </Button>
          <Button
            onClick={() => adjustPrice(askPrice, 5, onAskChange)}
            className="pixel-button flex-1 text-xs py-1 h-8"
            variant="outline"
          >
            +5
          </Button>
        </div>
      </div>

      {/* Spread & Margin Info */}
      <div className="pixel-border bg-muted/30 p-2 space-y-1">
        <div className="flex justify-between text-[10px]">
          <span>Spread:</span>
          <span className="font-bold">{spread} 💰</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>Margin:</span>
          <span className="font-bold text-accent">{profitMargin}%</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>Index:</span>
          <span className="font-bold">{marketPrice} 💰</span>
        </div>
      </div>
    </div>
  );
};
