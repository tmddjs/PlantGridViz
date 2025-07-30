import { useState, useEffect } from "react";
import { plantsData } from "../data/plantsData.js";
import PlantCell from "./PlantCell.jsx";
import SidePanel from "./SidePanel.jsx";

export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [hoveredPlant, setHoveredPlant] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);

  const plants = plantsData.map((data, index) => ({
    id: `plant-${index + 1}`,
    ...data
  }));

  useEffect(() => {
    let animationFrame;
    
    const handleMouseMove = (e) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const handleSelect = (plant) => {
    const index = selectedPlants.findIndex(p => p.id === plant.id);
    if (index >= 0) {
      setSelectedPlants(prev => prev.filter(p => p.id !== plant.id));
    } else {
      setSelectedPlants(prev => [...prev, plant]);
    }
  };

  const handleHover = (plant, index) => {
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
      <header className={`py-8 px-6 border-b border-botanical-light transition-all duration-300 ease-out ${
        hasSidePanelOpen ? 'text-center pr-80' : 'text-center'
      }`}>
        <div className={`transition-all duration-300 ease-out ${
          hasSidePanelOpen ? 'max-w-4xl mx-auto' : ''
        }`}>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Main Grid */}
        <main className={`py-12 px-6 transition-all duration-300 ease-out ${
          hasSidePanelOpen ? 'flex-1 pr-80' : 'w-full'
        }`}>
          <div className="max-w-4xl mx-auto">
            {/* Flexible Container allowing dynamic repositioning */}
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4" data-testid="plant-grid" style={{
              width: '100%',
              maxWidth: '800px'
            }}>
              {plants.map((plant, index) => (
                <PlantCell
                  key={plant.id}
                  plant={plant}
                  index={index}
                  isSelected={selectedPlants.some(p => p.id === plant.id)}
                  isHovered={hoveredPlant?.id === plant.id}
                  onSelect={handleSelect}
                  onHover={(p) => handleHover(p, index)}
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

      {/* Bottom Hover Detail */}
      {hoveredPlant && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-botanical-light p-3 transition-opacity duration-150 ease-out z-30">
          <div className={`max-w-4xl mx-auto text-center ${hasSidePanelOpen ? 'pr-80' : ''}`}>
            <div className="text-sm font-medium text-botanical-dark mb-1">
              {hoveredPlant.korean} <span className="italic text-botanical-medium">({hoveredPlant.scientific})</span>
            </div>
            <div className="text-xs text-botanical-medium space-x-4">
              <span>생활형: {hoveredPlant.lifeForm}</span>
              <span>최대높이: {hoveredPlant.maxHeight}m</span>
              <span>근계 깊이: {hoveredPlant.rootDepth}</span>
              <span>광요구도: {hoveredPlant.lightNeed}/10</span>
              <span>수명: {hoveredPlant.lifespan}년</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}