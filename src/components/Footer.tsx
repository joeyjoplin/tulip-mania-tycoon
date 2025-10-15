import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Vault as VaultIcon, GamepadIcon, LogIn } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login" className="gap-2">
              <LogIn className="h-4 w-4" />
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
  );
};
