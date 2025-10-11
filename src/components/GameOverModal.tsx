import { useState } from "react";
import { Button } from "./ui/button";

interface GameOverModalProps {
  isWin: boolean;
  finalCoins: number;
  finalDay: number;
  onRestart: () => void;
}

export const GameOverModal = ({ isWin, finalCoins, finalDay, onRestart }: GameOverModalProps) => {
  const [showEducationalScreen, setShowEducationalScreen] = useState(false);

  if (showEducationalScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="pixel-border bg-card p-8 max-w-3xl w-full space-y-6 animate-scale-in my-8">
          <h1 className="text-2xl text-center mb-4">
            🌷 Why Were Tulips Speculative?
          </h1>

          <div className="space-y-4 text-xs leading-relaxed">
            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">💰 Real Value vs. Speculative Value</h3>
              <p>
                A tulip is just a flower. It doesn't produce food, doesn't generate continuous income, 
                and withers in a few days. Its <strong>real value</strong> is merely decorative.
              </p>
            </div>

            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">📈 The Speculation Cycle</h3>
              <p className="mb-2">
                People didn't buy tulips to appreciate them, but to <strong>resell at a higher price</strong>. 
                The price rose not because of its real value, but from the belief that there would always be someone 
                willing to pay more.
              </p>
              <p className="text-primary">
                "I buy today for 100, sell tomorrow for 200" - but what happens when no one wants to buy anymore?
              </p>
            </div>

            <div className="pixel-border bg-muted/30 p-4">
              <h3 className="font-bold mb-2 text-accent">💥 The Inevitable Collapse</h3>
              <p className="mb-2">
                In February 1637, during an auction, no one showed up to buy. 
                The market realized: <strong>there were no final buyers</strong>, only speculators.
              </p>
              <p className="text-destructive font-bold">
                Prices plummeted 99% in weeks. Tulips that were worth houses became... tulips.
              </p>
            </div>

            {/* Modern Parallel with Memecoins */}
            <div className="pixel-border bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-4 border-2 border-orange-500/50">
              <h3 className="font-bold mb-3 text-center text-base">
                🪙 Tulips of 1637 = Memecoins of 2024?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="font-bold text-accent text-center">🌷 Tulips (1637)</p>
                  <ul className="space-y-1 text-[11px]">
                    <li>✓ No practical utility</li>
                    <li>✓ Price based on hype</li>
                    <li>✓ "Everyone is buying!"</li>
                    <li>✓ Promise of quick profit</li>
                    <li>✓ FOMO (fear of missing out)</li>
                    <li>✓ Sudden and devastating crash</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-primary text-center">🚀 Memecoins (Today)</p>
                  <ul className="space-y-1 text-[11px]">
                    <li>✓ No practical utility</li>
                    <li>✓ Price based on hype</li>
                    <li>✓ "To the moon! 🚀"</li>
                    <li>✓ Promise of quick profit</li>
                    <li>✓ FOMO (fear of missing out)</li>
                    <li>✓ Rug pulls and crashes</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-muted">
                <p className="text-center font-bold text-sm mb-2">
                  📊 The Patterns Repeat
                </p>
                <p className="text-[11px] mb-2">
                  <strong>Dogecoin, Shiba Inu, PEPE...</strong> are tokens with no real function, 
                  whose value depends exclusively on <em>believing that others will buy at a higher price</em>.
                </p>
                <p className="text-[11px] mb-2">
                  Just like tulips, memecoins don't generate income, have no practical utility, 
                  and their price can plummet to zero when the hype ends.
                </p>
                <p className="text-[11px] text-orange-500 font-bold">
                  ⚠️ The difference? In 1637 it took months. Today, a memecoin can collapse in hours.
                </p>
              </div>
            </div>

            <div className="pixel-border bg-primary/20 p-4 text-center">
              <p className="font-bold text-sm mb-2">🎓 The Great Lesson</p>
              <p className="mb-2">
                When the price of something rises only because everyone expects it to keep rising, 
                <strong className="text-accent"> it's not investment - it's speculation</strong>.
              </p>
              <p className="text-muted-foreground text-[11px] mb-2">
                And all speculation eventually meets reality.
              </p>
              <p className="text-[11px] font-bold mt-3 text-destructive">
                💡 Whether in tulips, memecoins, or NFTs - history repeats because human nature doesn't change.
              </p>
            </div>
          </div>

          <Button
            onClick={onRestart}
            className="pixel-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="pixel-border bg-card p-8 max-w-lg w-full space-y-6 animate-scale-in">
        <h1 className="text-3xl text-center mb-4">
          {isWin ? "🎉 Victory!" : "📉 Market Crash"}
        </h1>
        
        {isWin ? (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Congratulations! You accumulated <strong className="text-accent">{finalCoins} coins</strong> before 
              the tulip market collapse!
            </p>
            <p>
              You demonstrated wisdom by selling your tulips at the right time, 
              before the speculative bubble burst.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              On day {finalDay}, the tulip market collapsed. 
              You ended with <strong className="text-accent">{finalCoins} coins</strong>.
            </p>
            <p className="text-destructive">
              Tulips that were worth fortunes are now worth almost nothing...
            </p>
          </div>
        )}

        <div className="pixel-border bg-muted/30 p-4 space-y-3 text-xs leading-relaxed">
          <h3 className="font-bold text-center text-sm">📚 The Tulipmania Lesson</h3>
          <p>
            Between 1636-1637, in Holland, tulip prices rose to absurd levels. 
            A single rare tulip could be worth more than a house!
          </p>
          <p>
            But it was a <strong>speculative bubble</strong>: the price didn't reflect real value. 
            When the market realized this, prices plummeted.
          </p>
          <p className="text-center font-bold mt-2">
            ⚖️ Not all growth is sustainable.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowEducationalScreen(true)}
            variant="outline"
            className="pixel-button flex-1"
          >
            Learn More
          </Button>
          <Button
            onClick={onRestart}
            className="pixel-button flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};
