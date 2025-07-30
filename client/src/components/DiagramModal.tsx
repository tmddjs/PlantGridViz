import { Plant } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface DiagramModalProps {
  selectedPlants: Plant[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DiagramModal({ selectedPlants, isOpen, onClose }: DiagramModalProps) {
  if (selectedPlants.length === 0) return null;

  // Group by life form
  const grouped = selectedPlants.reduce((acc, plant) => {
    if (!acc[plant.lifeForm]) acc[plant.lifeForm] = [];
    acc[plant.lifeForm].push(plant);
    return acc;
  }, {} as Record<string, Plant[]>);

  // Calculate statistics
  const avgHeight = (selectedPlants.reduce((sum, p) => sum + p.maxHeight, 0) / selectedPlants.length).toFixed(1);
  const avgLifespan = Math.round(selectedPlants.reduce((sum, p) => sum + p.lifespan, 0) / selectedPlants.length);

  const getShapeElement = (lifeForm: string) => {
    switch (lifeForm) {
      case '교목':
        return <div className="w-2 h-2 bg-botanical-accent rounded-full" />;
      case '관목':
        return <div className="w-2 h-2 bg-botanical-medium" />;
      case '초화':
        return <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-botanical-border" />;
      default:
        return <div className="w-2 h-2 bg-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-4 p-12 bg-white border border-botanical-border font-crimson">
        <div className="text-right mb-6">
          <button 
            onClick={onClose}
            className="text-botanical-medium hover:text-botanical-dark text-xs transition-colors"
            data-testid="close-diagram-modal"
          >
            ✕
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-base font-semibold mb-2">선택된 식생 다이어그램</h2>
          <p className="text-xs text-botanical-medium">Selected Botanical Composition</p>
        </div>
        
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-8 text-center mb-8 pb-6 border-b border-botanical-light">
            <div>
              <div className="text-xl font-light text-botanical-accent">{selectedPlants.length}</div>
              <div className="text-xs text-botanical-medium">총 선택 종</div>
            </div>
            <div>
              <div className="text-xl font-light text-botanical-accent">{avgHeight}m</div>
              <div className="text-xs text-botanical-medium">평균 높이</div>
            </div>
            <div>
              <div className="text-xl font-light text-botanical-accent">{avgLifespan}</div>
              <div className="text-xs text-botanical-medium">평균 수명(년)</div>
            </div>
          </div>
          
          {/* Composition Diagram */}
          <div className="space-y-6">
            {Object.entries(grouped).map(([lifeForm, plants]) => (
              <div key={lifeForm} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{lifeForm}</h4>
                  <span className="text-xs text-botanical-medium">{plants.length}종</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plants.map((plant, index) => (
                    <div key={`${plant.id}-${index}`} className="flex items-center space-x-2 text-xs p-2 border border-botanical-light bg-gray-50">
                      {getShapeElement(lifeForm)}
                      <span>{plant.korean}</span>
                      <span className="text-botanical-medium">{plant.maxHeight}m</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Visual Composition */}
          <div className="mt-8 pt-6 border-t border-botanical-light">
            <h4 className="text-sm font-medium mb-4 text-center">시각적 구성</h4>
            <div className="relative h-32 border border-botanical-light overflow-hidden">
              {selectedPlants.map((plant, index) => {
                const sizeClass = plant.lifeForm === '교목' ? 'w-4 h-4' : plant.lifeForm === '관목' ? 'w-3 h-3' : 'w-2 h-2';
                const bgClass = plant.lifeForm === '교목' ? 'bg-botanical-accent rounded-full' : plant.lifeForm === '관목' ? 'bg-botanical-medium' : 'bg-botanical-border';
                const left = (index % 12) * 8;
                const top = Math.floor(index / 12) * 16;
                
                return (
                  <div
                    key={`visual-${plant.id}-${index}`}
                    className={`absolute ${sizeClass} ${bgClass} opacity-70`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    title={plant.korean}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
