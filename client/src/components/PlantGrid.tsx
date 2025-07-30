import { useState, useEffect } from "react";
import { Plant } from "@shared/schema";
import { plantsData } from "@/data/plantsData";
import PlantCell from "./PlantCell";
import HoverDetail from "./HoverDetail";
import SidePanel from "./SidePanel";

export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [hoveredPlant, setHoveredPlant] = useState<Plant | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Convert plantsData to Plant objects with generated IDs
  const plants: Plant[] = plantsData.map((data, index) => ({
    id: `plant-${index + 1}`,
    ...data
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSelect = (plant: Plant) => {
    const index = selectedPlants.findIndex(p => p.id === plant.id);
    if (index >= 0) {
      setSelectedPlants(prev => prev.filter(p => p.id !== plant.id));
    } else {
      setSelectedPlants(prev => [...prev, plant]);
    }
  };

  const handleHover = (plant: Plant | null) => {
    setHoveredPlant(plant);
  };

  const clearSelection = () => {
    setSelectedPlants([]);
  };

  const hasSidePanelOpen = selectedPlants.length > 0;

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

      {/* Main Content */}
      <div className="flex">
        {/* Main Grid */}
        <main className={`py-12 px-6 transition-all duration-300 ease-out ${
          hasSidePanelOpen ? 'flex-1 pr-80' : 'w-full'
        }`}>
          <div className="max-w-4xl mx-auto">
            {/* Grid Container */}
            <div className="grid grid-cols-10 gap-x-6 gap-y-8 justify-items-center" data-testid="plant-grid">
              {plants.map((plant, index) => (
                <PlantCell
                  key={plant.id}
                  plant={plant}
                  index={index}
                  isSelected={selectedPlants.some(p => p.id === plant.id)}
                  isHovered={hoveredPlant?.id === plant.id}
                  onSelect={handleSelect}
                  onHover={handleHover}
                  mousePosition={mousePosition}
                />
              ))}
            </div>
          </div>
        </main>
        
        {/* Side Panel */}
        <SidePanel
          selectedPlants={selectedPlants}
          isVisible={hasSidePanelOpen}
          onClear={clearSelection}
        />
      </div>

      {/* Hover Detail */}
      <HoverDetail
        plant={hoveredPlant}
        isVisible={!!hoveredPlant}
      />
    </div>
  );
}
