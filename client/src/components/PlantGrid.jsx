import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { plantsData } from "../data/plantsData.js";
import PlantCell from "./PlantCell.jsx";

export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [hoveredPlant, setHoveredPlant] = useState(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

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
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
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

  // no external image fetch

  const handleSelect = (plant) => {
    const index = selectedPlants.findIndex(p => p.id === plant.id);
    if (index >= 0) {
      setSelectedPlants(prev => prev.filter(p => p.id !== plant.id));
    } else {
      setSelectedPlants(prev => [...prev, plant]);
    }
  };

  const handleHover = (plant) => {
    setHoveredPlant(plant);
  };

  const clearSelection = () => {
    setSelectedPlants([]);
  };


  return (
    <div className="font-crimson text-botanical-dark min-h-screen bg-white">
      {/* Header */}
      <header className="py-8 px-6 border-b border-botanical-light text-center">
        <div>
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
        <main className="py-12 px-6 w-full">
          <div className="max-w-4xl mx-auto">
            {/* Flexible Container allowing dynamic repositioning */}
            <motion.div
              layout
              transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
              className="flex flex-col items-center gap-y-4"
              data-testid="plant-grid"
              style={{
                width: '100%',
                maxWidth: '680px'
              }}
            >
              {Array.from({ length: Math.ceil(plants.length / 10) }).map((_, rowIdx) => {
                const rowPlants = plants.slice(rowIdx * 10, rowIdx * 10 + 10);
                const containsHovered = hoveredPlant && rowPlants.some(p => p.id === hoveredPlant.id);
                return (
                  <div key={rowIdx} className="w-full">
                    <div className="flex justify-center gap-x-2">
                      {rowPlants.map((plant, index) => (
                        <PlantCell
                          key={plant.id}
                          plant={plant}
                          index={rowIdx * 10 + index}
                          isSelected={selectedPlants.some(p => p.id === plant.id)}
                          isHovered={hoveredPlant?.id === plant.id}
                          onSelect={handleSelect}
                          onHover={(p) => handleHover(p)}
                          mousePositionRef={mousePositionRef}
                        />
                      ))}
                    </div>
                    {containsHovered && (
                      <div className="mt-2 p-4 border border-botanical-light bg-white text-xs">
                        <div className="text-sm font-medium text-botanical-dark mb-1">
                          {hoveredPlant.korean}{" "}
                          <span className="italic text-botanical-medium">({hoveredPlant.scientific})</span>
                        </div>
                        <div className="space-y-0.5">
                          <div>생활형: {hoveredPlant.lifeForm}</div>
                          <div>최대높이: {hoveredPlant.maxHeight}m</div>
                          <div>근계 깊이: {hoveredPlant.rootDepth}</div>
                          <div>광요구도: {hoveredPlant.lightNeed}/10</div>
                          <div>수명: {hoveredPlant.lifespan}년</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </main>
        
      </div>

    </div>
  );
}
