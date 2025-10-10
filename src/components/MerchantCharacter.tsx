interface MerchantCharacterProps {
  day: number;
  currentPrice: number;
  previousPrice?: number;
}

export const MerchantCharacter = ({ day, currentPrice, previousPrice }: MerchantCharacterProps) => {
  const getMerchantMood = () => {
    if (day >= 25) return "panic";
    if (day >= 20) return "worried";
    if (day >= 15) return "greedy";
    if (day >= 10) return "excited";
    return "neutral";
  };

  const getMerchantDialogue = () => {
    const mood = getMerchantMood();
    const priceChange = previousPrice ? currentPrice - previousPrice : 0;

    switch (mood) {
      case "panic":
        return [
          "🥵 Algo está errado...",
          "😰 Talvez devêssemos parar?",
          "😱 Todos estão vendendo!"
        ][Math.floor((day - 25) % 3)];
      
      case "worried":
        return [
          "🤔 Esses preços parecem... altos demais",
          "😬 Será que isso é sustentável?",
          "😟 Estou ficando nervoso..."
        ][Math.floor((day - 20) % 3)];
      
      case "greedy":
        return [
          "🤑 Compre TUDO! Os preços só sobem!",
          "💰 Nunca vi tanto dinheiro!",
          "✨ Isto é mágico! Ficamos ricos!"
        ][Math.floor((day - 15) % 3)];
      
      case "excited":
        return priceChange > 0 
          ? "😃 Ótimas notícias! Preços em alta!"
          : "😊 Negócios estão indo bem!";
      
      default:
        return "👨‍💼 Bem-vinda! Tenho as melhores ofertas!";
    }
  };

  const getMerchantAnimation = () => {
    const mood = getMerchantMood();
    switch (mood) {
      case "panic": return "animate-shake";
      case "worried": return "animate-pulse";
      case "greedy": return "animate-bounce";
      default: return "";
    }
  };

  return (
    <div className="pixel-border bg-muted/20 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className={`text-5xl ${getMerchantAnimation()}`}>
          🧔‍♂️
        </div>
        <div className="flex-1 space-y-2">
          <div className="pixel-border bg-card/80 p-3 rounded-lg relative">
            <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-card/80"></div>
            <p className="text-xs leading-relaxed">
              {getMerchantDialogue()}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            Mercador Jan van der Meer
          </p>
        </div>
      </div>
    </div>
  );
};
