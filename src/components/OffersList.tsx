import { Button } from "./ui/button";

export interface Offer {
  id: string;
  type: "farmer" | "client";
  quantity: number;
  price: number;
  name: string;
}

interface OffersListProps {
  offers: Offer[];
  onAccept: (offer: Offer) => void;
  onReject: (offerId: string) => void;
}

export const OffersList = ({ offers, onAccept, onReject }: OffersListProps) => {
  const farmerOffers = offers.filter(o => o.type === "farmer");
  const clientOffers = offers.filter(o => o.type === "client");

  return (
    <div className="space-y-4">
      {/* Farmer Offers (Buy) */}
      {farmerOffers.length > 0 && (
        <div className="pixel-border bg-card p-3 space-y-2">
          <h3 className="text-xs text-center mb-2">🌾 Farmers' Offers</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {farmerOffers.map(offer => (
              <div key={offer.id} className="pixel-border bg-muted/20 p-2 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold">{offer.name}</span>
                  <span>{offer.quantity} 🌷</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px]">Min price: <span className="font-bold text-green-400">{offer.price} 💰</span></span>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onAccept(offer)}
                      className="pixel-button text-[10px] py-0 h-6 px-2"
                      variant="default"
                    >
                      Buy
                    </Button>
                    <Button
                      onClick={() => onReject(offer.id)}
                      className="pixel-button text-[10px] py-0 h-6 px-2"
                      variant="outline"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Offers (Sell) */}
      {clientOffers.length > 0 && (
        <div className="pixel-border bg-card p-3 space-y-2">
          <h3 className="text-xs text-center mb-2">👥 Client Orders</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {clientOffers.map(offer => (
              <div key={offer.id} className="pixel-border bg-muted/20 p-2 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold">{offer.name}</span>
                  <span>{offer.quantity} 🌷</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px]">Max price: <span className="font-bold text-red-400">{offer.price} 💰</span></span>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onAccept(offer)}
                      className="pixel-button text-[10px] py-0 h-6 px-2"
                      variant="default"
                    >
                      Sell
                    </Button>
                    <Button
                      onClick={() => onReject(offer.id)}
                      className="pixel-button text-[10px] py-0 h-6 px-2"
                      variant="outline"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {offers.length === 0 && (
        <div className="pixel-border bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground">Waiting for offers...</p>
        </div>
      )}
    </div>
  );
};
