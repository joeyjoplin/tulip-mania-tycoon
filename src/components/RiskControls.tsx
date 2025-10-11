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
      <h3 className="text-xs text-center mb-2">🎲 Gestão de Risco</h3>
      
      <Button
        onClick={onHoldStock}
        disabled={!canHoldStock}
        className="pixel-button w-full text-xs py-2 h-auto"
        variant="outline"
        title="Reduz decay para 4%, custa 50 florins"
      >
        🛡️ Proteger Estoque (-50 💰)
      </Button>

      <Button
        onClick={onFlashSale}
        disabled={!canFlashSale || isFlashSaleActive}
        className="pixel-button w-full text-xs py-2 h-auto"
        variant="outline"
        title="Reduz preço de venda em 20% por 1 dia"
      >
        ⚡ {isFlashSaleActive ? "Promoção Ativa!" : "Promoção Relâmpago"}
      </Button>
    </div>
  );
};
