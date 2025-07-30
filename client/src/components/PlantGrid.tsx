import { useState } from "react";
import { Plant } from "@shared/schema";
import { plantsData } from "@/data/plantsData";
import PlantCell from "./PlantCell";
import PlantDetailModal from "./PlantDetailModal";
import DiagramModal from "./DiagramModal";

export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  // Convert plantsData to Plant objects with generated IDs
  const plants: Plant[] = plantsData.map((data, index) => ({
    id: `plant-${index + 1}`,
    ...data
  }));

  const handleSelect = (plant: Plant, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      const index = selectedPlants.findIndex(p => p.id === plant.id);
      if (index >= 0) {
        setSelectedPlants(prev => prev.filter(p => p.id !== plant.id));
      } else {
        setSelectedPlants(prev => [...prev, plant]);
      }
    } else {
      setSelectedPlants([plant]);
    }
  };

  const handleShowDetail = (plant: Plant) => {
    setDetailPlant(plant);
    setIsDetailOpen(true);
  };

  const clearSelection = () => {
    setSelectedPlants([]);
  };

  const generateDiagram = () => {
    if (selectedPlants.length === 0) {
      alert('선택된 식생이 없습니다.');
      return;
    }
    setIsDiagramOpen(true);
  };

  return (
    <div className="font-crimson text-botanical-dark min-h-screen bg-white">
      {/* Header */}
      <header className="py-8 px-6 text-center border-b border-botanical-light">
        <h1 className="text-lg font-normal tracking-wide mb-2">식생 컬렉션</h1>
        <p className="text-xs text-botanical-medium font-light">Botanical Species Interactive Grid</p>
        
        {/* Selected Counter */}
        <div className="mt-4 text-xs text-botanical-medium">
          <span>선택된 항목: </span>
          <span className="font-semibold text-botanical-accent transition-all duration-200">
            {selectedPlants.length}
          </span>
          <span> / 100</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Grid Container */}
          <div className="grid grid-cols-10 gap-3 mb-8 justify-items-center" data-testid="plant-grid">
            {plants.map((plant, index) => (
              <PlantCell
                key={plant.id}
                plant={plant}
                index={index}
                isSelected={selectedPlants.some(p => p.id === plant.id)}
                onSelect={handleSelect}
                onShowDetail={handleShowDetail}
              />
            ))}
          </div>
          
          {/* Action Bar */}
          <div className="text-center mt-12">
            <button 
              onClick={clearSelection}
              className="text-xs text-botanical-medium hover:text-botanical-dark transition-colors border-b border-transparent hover:border-botanical-light pb-1"
              data-testid="clear-selection"
            >
              선택 해제
            </button>
            <span className="mx-4 text-botanical-light">|</span>
            <button 
              onClick={generateDiagram}
              className="text-xs text-botanical-accent hover:text-botanical-dark transition-colors border-b border-transparent hover:border-botanical-accent pb-1"
              data-testid="generate-diagram"
            >
              다이어그램 생성
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PlantDetailModal
        plant={detailPlant}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      
      <DiagramModal
        selectedPlants={selectedPlants}
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />
    </div>
  );
}
