interface GameStatsProps {
  coins: number;
  day: number;
  stock: number;
  reputation?: number; // Optional for farmer role
  marketPrice: number;
  hype: number;
  priceChange: number;
}

export const GameStats = ({ 
  coins, 
  day, 
  stock, 
  reputation, 
  marketPrice, 
  hype,
  priceChange 
}: GameStatsProps) => {
  const priceColor = priceChange > 0 ? "text-green-400" : priceChange < 0 ? "text-red-400" : "";
  const priceArrow = priceChange > 0 ? "↑" : priceChange < 0 ? "↓" : "→";

  return (
    <div className={`w-full grid gap-2 ${reputation !== undefined ? 'grid-cols-2 md:grid-cols-6' : 'grid-cols-2 md:grid-cols-5'}`}>
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">💰 Florins</div>
        <div className="text-lg font-bold text-accent animate-coin-float">
          {coins}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">📅 Day</div>
        <div className="text-lg font-bold">
          {day}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">🌷 Stock</div>
        <div className="text-lg font-bold text-primary">
          {stock}
        </div>
      </div>

      {/* Reputation - only show for merchant */}
      {reputation !== undefined && (
        <div className="pixel-border bg-card p-2 text-center">
          <div className="text-[10px] mb-1">⭐ Reputation</div>
          <div className="text-lg font-bold">
            {reputation}
          </div>
        </div>
      )}

      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">📊 Index</div>
        <div className={`text-lg font-bold ${priceColor} transition-colors`}>
          {marketPrice} {priceArrow}
        </div>
      </div>

      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">🔥 Hype</div>
        <div className="text-lg font-bold">
          {hype}%
        </div>
      </div>
    </div>
  );
};
