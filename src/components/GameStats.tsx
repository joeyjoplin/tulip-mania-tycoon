interface GameStatsProps {
  coins: number;
  day: number;
  tulipsInInventory: number;
}

export const GameStats = ({ coins, day, tulipsInInventory }: GameStatsProps) => {
  return (
    <div className="w-full grid grid-cols-3 gap-4">
      <div className="pixel-border bg-card p-4 text-center">
        <div className="text-sm mb-1">💰 Moedas</div>
        <div className="text-2xl font-bold text-accent animate-coin-float">
          {coins}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-4 text-center">
        <div className="text-sm mb-1">📅 Dia</div>
        <div className="text-2xl font-bold">
          {day}
        </div>
      </div>
      
      <div className="pixel-border bg-card p-4 text-center">
        <div className="text-sm mb-1">🌷 Estoque</div>
        <div className="text-2xl font-bold text-primary">
          {tulipsInInventory}
        </div>
      </div>
    </div>
  );
};
