import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";

const Vault = () => {
  const vaultItems = [
    { id: 1, name: "Semper Augustus", rarity: "Legendary", value: 5000 },
    { id: 2, name: "Admiral van Enkhuizen", rarity: "Rare", value: 2000 },
    { id: 3, name: "Viceroy", rarity: "Common", value: 500 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Vault
            </h1>
            <p className="text-sm text-muted-foreground">
              Your collection of rare tulip bulbs
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant={item.rarity === "Legendary" ? "default" : "secondary"}>
                      {item.rarity}
                    </Badge>
                  </div>
                  <CardDescription>Value: {item.value} florins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">🌷</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {vaultItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Your vault is empty. Start trading to collect rare tulips!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vault;
