import { Button } from "./ui/button";

interface RiskControlsProps {
  onHoldStock: () => void;
  onFlashSale: () => void;
  canHoldStock: boolean;
  canFlashSale: boolean;
  isFlashSaleActive: boolean;
}

export const RiskControls = ({
  onHoldStock,
  onFlashSale,
  canHoldStock,
  canFlashSale,
  isFlashSaleActive,
}: RiskControlsProps) => {
  return (
    <div className="pixel-border bg-card/50 p-3 space-y-2">
      <h3 className="text-xs text-center mb-2">🎲 Risk Management</h3>
      
      <Button
        onClick={onHoldStock}
        disabled={!canHoldStock}
        className="pixel-button w-full text-xs py-2 h-auto"
        variant="outline"
        title="Reduces decay to 4%, costs 50 florins"
      >
        🛡️ Protect Stock (-50 💰)
      </Button>

      <Button
        onClick={onFlashSale}
        disabled={!canFlashSale || isFlashSaleActive}
        className="pixel-button w-full text-xs py-2 h-auto"
        variant="outline"
        title="Reduces sell price by 20% for 1 day"
      >
        ⚡ {isFlashSaleActive ? "Sale Active!" : "Flash Sale"}
      </Button>
    </div>
  );
};
