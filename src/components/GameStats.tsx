interface GameStatsProps {
  coins: number;
  day: number;
  stock: number;
  reputation: number;
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
    <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-2">
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">💰 Florins</div>
        <div className="text-lg font-bold text-accent animate-coin-float">
          {coins}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">📅 Dia</div>
        <div className="text-lg font-bold">
          {day}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">🌷 Estoque</div>
        <div className="text-lg font-bold text-primary">
          {stock}
        </div>
      </div>

      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">⭐ Reputação</div>
        <div className="text-lg font-bold">
          {reputation}
        </div>
      </div>

      <div className="pixel-border bg-card p-2 text-center">
        <div className="text-[10px] mb-1">📊 Índice</div>
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
