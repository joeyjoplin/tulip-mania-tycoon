import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const Ranking = () => {
  const rankings = [
    { rank: 1, name: "Jan Pietersz", wealth: 50000, icon: Trophy },
    { rank: 2, name: "Willem de Ruyter", wealth: 35000, icon: Medal },
    { rank: 3, name: "Hendrik van Hoorn", wealth: 28000, icon: Award },
    { rank: 4, name: "Cornelis de Graaf", wealth: 22000 },
    { rank: 5, name: "Pieter Jansz", wealth: 18000 },
    { rank: 6, name: "Jacob van Neck", wealth: 15000 },
    { rank: 7, name: "Dirk Hartog", wealth: 12000 },
    { rank: 8, name: "Frans Hals", wealth: 10000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Merchant Rankings
          </h1>
          <p className="text-sm text-muted-foreground">
            Top tulip traders of Amsterdam
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankings.map((merchant) => {
                const Icon = merchant.icon;
                return (
                  <div
                    key={merchant.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {Icon ? (
                          <Icon className="w-5 h-5 text-primary" />
                        ) : (
                          <span className="font-bold text-muted-foreground">#{merchant.rank}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{merchant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {merchant.wealth.toLocaleString()} florins
                        </p>
                      </div>
                    </div>
                    {merchant.rank <= 3 && (
                      <Badge variant="default">
                        Top {merchant.rank}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ranking;
