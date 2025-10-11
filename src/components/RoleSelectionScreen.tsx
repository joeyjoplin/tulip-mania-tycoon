import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type GameRole = "farmer" | "merchant";

interface RoleSelectionScreenProps {
  onSelectRole: (role: GameRole) => void;
}

export const RoleSelectionScreen = ({ onSelectRole }: RoleSelectionScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">🌷 Tulips Game</h1>
          <p className="text-lg text-muted-foreground">
            Holland, 17th century - The Tulipmania era
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Choose your role in this story of speculation and trade
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">👩‍🌾</div>
              <CardTitle className="text-2xl">Farmer</CardTitle>
              <CardDescription>Grow and sell tulips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-lg">🌱</span>
                  <span>Plant and grow tulips in your field</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">⏱️</span>
                  <span>Wait for growth and harvest at the right time</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">💰</span>
                  <span>Sell to merchants at the best price</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Focus on production and selling timing</span>
                </p>
              </div>
              <Button 
                onClick={() => onSelectRole("farmer")} 
                className="w-full"
                size="lg"
              >
                Play as Farmer
              </Button>
            </CardContent>
          </Card>

          {/* Merchant Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🧔‍♂️</div>
              <CardTitle className="text-2xl">Merchant</CardTitle>
              <CardDescription>Buy low, sell high</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-lg">📊</span>
                  <span>Control buy and sell prices</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🤝</span>
                  <span>Negotiate with farmers and clients</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">⚖️</span>
                  <span>Manage inventory and reputation</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Focus on strategy and speculation</span>
                </p>
              </div>
              <Button 
                onClick={() => onSelectRole("merchant")} 
                className="w-full"
                size="lg"
              >
                Play as Merchant
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Educational Note */}
        <div className="text-center text-xs text-muted-foreground max-w-2xl mx-auto px-4 py-6 bg-muted/30 rounded-lg">
          <p className="mb-2">
            ⚠️ <strong>Warning:</strong> This is an educational game about the 1637 tulip speculative bubble
          </p>
          <p>
            Both roles will face the market collapse. The goal is to survive and learn about financial speculation.
          </p>
        </div>
      </div>
    </div>
  );
};
