import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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

  return (
    <div className="w-full">
      <div className="pixel-border bg-card p-6">
        <h2 className="text-xl mb-4 text-center">📊 Mercado de Tulipas</h2>
        
        <div className="mb-4">
          <div className="text-center mb-2">
            <span className="text-sm">Preço Atual:</span>
            <div className={`text-3xl font-bold text-accent ${animatePrice ? 'animate-pulse-price' : ''}`}>
              {currentPrice}💰
            </div>
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
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tulipas no estoque:</span>
            <span className="font-bold">{tulipsInInventory} 🌷</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Valor total:</span>
            <span className="font-bold text-accent">
              {tulipsInInventory * currentPrice} 💰
            </span>
          </div>

          <Button
            onClick={onSell}
            disabled={tulipsInInventory === 0}
            className="pixel-button w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Vender Tudo
          </Button>
        </div>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          Dia {day} - {day < 15 ? "📈 Mercado em alta" : day < 25 ? "⚠️ Volatilidade" : "🔴 Risco de colapso"}
        </div>
      </div>
    </div>
  );
};
