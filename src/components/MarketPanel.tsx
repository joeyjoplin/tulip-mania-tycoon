import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MerchantCharacter } from "./MerchantCharacter";

interface MarketPanelProps {
  currentPrice: number;
  tulipsInInventory: number;
  onSell: () => void;
  day: number;
  priceHistory: number[];
}

export const MarketPanel = ({ 
  currentPrice, 
  tulipsInInventory, 
  onSell, 
  day,
  priceHistory 
}: MarketPanelProps) => {
  const [animatePrice, setAnimatePrice] = useState(false);

  useEffect(() => {
    setAnimatePrice(true);
    const timeout = setTimeout(() => setAnimatePrice(false), 500);
    return () => clearTimeout(timeout);
  }, [currentPrice]);

  const maxPrice = Math.max(...priceHistory, 100);

  const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2] : undefined;

  return (
    <div className="w-full">
      <div className="pixel-border bg-card p-6 space-y-4">
        <h2 className="text-xl text-center">🏛️ Tulip Market</h2>
        
        <MerchantCharacter 
          day={day} 
          currentPrice={currentPrice}
          previousPrice={previousPrice}
        />
        
        <div className="pixel-border bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
          <p className={`text-3xl font-bold transition-all duration-300 ${
            animatePrice ? 'text-accent animate-pulse-price' : ''
          }`}>
            💰 {currentPrice}
          </p>
          <p className="text-xs text-muted-foreground mt-1">coins per tulip</p>
        </div>
        
        {/* Simple price chart */}
        <div className="h-32 pixel-border bg-background p-2 flex items-end gap-1">
          {priceHistory.slice(-20).map((price, i) => (
            <div
              key={i}
              className="flex-1 bg-primary transition-all duration-300"
              style={{ 
                height: `${(price / maxPrice) * 100}%`,
                minHeight: '2px'
              }}
            />
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tulips in stock:</span>
            <span className="font-bold">{tulipsInInventory} 🌷</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Total value:</span>
            <span className="font-bold text-accent">
              {tulipsInInventory * currentPrice} 💰
            </span>
          </div>

          <Button
            onClick={onSell}
            disabled={tulipsInInventory === 0}
            className="pixel-button w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Sell All
          </Button>
        </div>

      </div>
    </div>
  );
};
