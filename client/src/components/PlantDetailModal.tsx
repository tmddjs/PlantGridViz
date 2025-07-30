import { Plant } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface PlantDetailModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlantDetailModal({ plant, isOpen, onClose }: PlantDetailModalProps) {
  if (!plant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 p-8 bg-botanical-modal border border-botanical-border font-crimson">
        <div className="text-right mb-4">
          <button 
            onClick={onClose}
            className="text-botanical-medium hover:text-botanical-dark text-xs transition-colors"
            data-testid="close-detail-modal"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{plant.korean}</h3>
            <p className="text-xs italic text-botanical-medium">{plant.scientific}</p>
          </div>
          
          <div className="pt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-botanical-medium">생활형</span>
              <span>{plant.lifeForm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-medium">최대 높이</span>
              <span>{plant.maxHeight}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-medium">뿌리 깊이</span>
              <span>{plant.rootDepth}cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-medium">필요 광량</span>
              <span>{plant.lightNeed}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-botanical-medium">전형 수명</span>
              <span>{plant.lifespan}년</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
