import { useState, useEffect, Fragment } from "react";
import { Plant } from "@shared/schema";
import { plantsData } from "@/data/plantsData";
import PlantCell from "./PlantCell";
import InlineDetail from "./InlineDetail";
import SidePanel from "./SidePanel";

export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [hoveredPlant, setHoveredPlant] = useState<Plant | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const handleHover = (plant: Plant | null, index?: number) => {
    setHoveredPlant(plant);
    setHoveredIndex(plant ? (index ?? null) : null);
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
            {/* Grid Container with inline details */}
            <div className="grid grid-cols-10 gap-x-6 gap-y-8 justify-items-center auto-rows-min" data-testid="plant-grid">
              {plants.map((plant, index) => {
                const isRowEnd = (index + 1) % 10 === 0;
                const shouldShowDetail = hoveredIndex === index;
                
                return (
                  <Fragment key={plant.id}>
                    <PlantCell
                      plant={plant}
                      index={index}
                      isSelected={selectedPlants.some(p => p.id === plant.id)}
                      isHovered={hoveredPlant?.id === plant.id}
                      onSelect={handleSelect}
                      onHover={(p) => handleHover(p, index)}
                      mousePosition={mousePosition}
                    />
                    
                    {/* Show inline detail at end of row if any plant in this row is hovered */}
                    {isRowEnd && hoveredIndex !== null && Math.floor(hoveredIndex / 10) === Math.floor(index / 10) && (
                      <InlineDetail
                        plant={hoveredPlant}
                        isVisible={!!hoveredPlant}
                        gridIndex={hoveredIndex}
                      />
                    )}
                  </Fragment>
                );
              })}
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


    </div>
  );
}
