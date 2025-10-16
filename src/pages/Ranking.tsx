import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const Ranking = () => {
  const currentUserRank = 5; // Current user position
  const currentUserName = "You";
  
  const rankings = [
    { rank: 1, name: "Jan Pietersz", wealth: 50000, trades: 247, winRate: 78, icon: Trophy },
    { rank: 2, name: "Willem de Ruyter", wealth: 35000, trades: 189, winRate: 72, icon: Medal },
    { rank: 3, name: "Hendrik van Hoorn", wealth: 28000, trades: 156, winRate: 69, icon: Award },
    { rank: 4, name: "Cornelis de Graaf", wealth: 22000, trades: 142, winRate: 65 },
    { rank: 5, name: currentUserName, wealth: 18000, trades: 98, winRate: 61, isCurrentUser: true },
    { rank: 6, name: "Jacob van Neck", wealth: 15000, trades: 87, winRate: 58 },
    { rank: 7, name: "Dirk Hartog", wealth: 12000, trades: 76, winRate: 54 },
    { rank: 8, name: "Frans Hals", wealth: 10000, trades: 65, winRate: 51 },
    { rank: 9, name: "Rembrandt van Rijn", wealth: 8500, trades: 53, winRate: 48 },
    { rank: 10, name: "Johannes Vermeer", wealth: 7200, trades: 41, winRate: 45 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ranking
            </h1>
            <p className="text-sm text-muted-foreground">
              Top 10 tulip traders in Amsterdam
            </p>
          </header>

          {/* User Position Highlight */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your Position</p>
                    <p className="text-sm text-muted-foreground">
                      {rankings.find(r => r.isCurrentUser)?.wealth.toLocaleString()} guilders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="text-lg px-4 py-1">
                    #{currentUserRank}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rankings.map((merchant) => {
                  const Icon = merchant.icon;
                  const isCurrentUser = merchant.isCurrentUser;
                  
                  return (
                    <div
                      key={merchant.rank}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg transition-all",
                        isCurrentUser 
                          ? "bg-primary/10 border-2 border-primary shadow-md" 
                          : "bg-muted/50 hover:bg-muted border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {Icon ? (
                            <Icon className={cn(
                              "w-6 h-6",
                              merchant.rank === 1 ? "text-yellow-500" :
                              merchant.rank === 2 ? "text-gray-400" :
                              merchant.rank === 3 ? "text-amber-700" :
                              "text-primary"
                            )} />
                          ) : (
                            <span className={cn(
                              "font-bold text-lg",
                              isCurrentUser ? "text-primary" : "text-muted-foreground"
                            )}>
                              #{merchant.rank}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-semibold",
                              isCurrentUser && "text-primary"
                            )}>
                              {merchant.name}
                            </p>
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>{merchant.trades} trades</span>
                            <span>{merchant.winRate}% win rate</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={cn(
                            "font-bold text-lg",
                            isCurrentUser && "text-primary"
                          )}>
                            {merchant.wealth.toLocaleString()} ƒ
                          </p>
                        </div>
                      </div>

                      {merchant.rank <= 3 && !isCurrentUser && (
                        <Badge 
                          variant="default" 
                          className={cn(
                            "ml-2",
                            merchant.rank === 1 && "bg-yellow-500 hover:bg-yellow-600",
                            merchant.rank === 2 && "bg-gray-400 hover:bg-gray-500",
                            merchant.rank === 3 && "bg-amber-700 hover:bg-amber-800"
                          )}
                        >
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
      <Footer />
    </div>
  );
};

export default Ranking;
