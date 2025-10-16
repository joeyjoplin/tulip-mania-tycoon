import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Trophy, Vault as VaultIcon, GamepadIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <header className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tulip Trader
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the legendary Dutch Tulip Mania of 1637. Buy, sell, and trade your way to fortune in history's first speculative bubble.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12">
            <div className="p-4 rounded-lg bg-card border">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Trade Tulips</h3>
              <p className="text-xs text-muted-foreground">
                Buy low, sell high in a dynamic market
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <VaultIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Build Your Vault</h3>
              <p className="text-xs text-muted-foreground">
                Collect rare and valuable tulip bulbs
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Compete</h3>
              <p className="text-xs text-muted-foreground">
                Climb the merchant rankings
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login" className="gap-2">
                <span>Login</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/game" className="gap-2">
                <GamepadIcon className="h-4 w-4" />
                <span>Game</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/vault" className="gap-2">
                <VaultIcon className="h-4 w-4" />
                <span>Vault</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/ranking" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span>Ranking</span>
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
