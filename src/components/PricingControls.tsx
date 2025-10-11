import { Button } from "./ui/button";

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
      <h3 className="text-xs text-center mb-2">⚖️ Buy/Sell Prices</h3>
      
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
