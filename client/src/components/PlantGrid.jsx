import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { plantsData } from "../data/plantsData.js";   // ← 경로 수정
import PlantCell from "./PlantCell.jsx";
import SidePanel from "./SidePanel.jsx";   
export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [hoveredPlant, setHoveredPlant] = useState(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const HOVER_OPEN_DELAY = 100;
  const HOVER_CLOSE_DELAY = 100;

  // id 부여 + 데이터 전개 연산자 수정 (.data ➜ ...data)
  const plants = plantsData.map((data, index) => ({
    id: `plant-${index + 1}`,
    ...data,
  }));                                                /* :contentReference[oaicite:1]{index=1} */

  /* 마우스 위치 추적 → 각 셀 scale 계산용 */
  useEffect(() => {
    let frame;
    const handleMouseMove = (e) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
      });
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* 선택 토글 */
  const handleSelect = (plant) =>
    setSelectedPlants((prev) =>
      prev.some((p) => p.id === plant.id)
        ? prev.filter((p) => p.id !== plant.id)
        : [...prev, plant]                            /* 기존 [.prev] → [...prev] 수정 */
    );

  const handleHover = (plant) => {
    if (plant) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      openTimeoutRef.current = setTimeout(() => {
        setHoveredPlant(plant);
      }, HOVER_OPEN_DELAY);
    } else {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => {
        setHoveredPlant(null);
      }, HOVER_CLOSE_DELAY);
    }
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);
  const clearSelection = () => setSelectedPlants([]);

  return (
    <div className="font-crimson text-botanical-dark min-h-screen bg-white">
      {/* ───── Header ───── */}
      <header className="py-8 px-6 border-b border-botanical-light text-center">
        <h1 className="text-lg font-normal tracking-wide mb-2">식생 컬렉션</h1>
        <p className="text-xs text-botanical-medium font-light">
          Botanical Species Interactive Grid
        </p>
        <div className="mt-4 text-xs text-botanical-medium">
          <span>선택된 항목: </span>
          <span className="font-semibold text-botanical-accent">
            {selectedPlants.length}
          </span>
          <span> / 100</span>
        </div>
      </header>

      <div className="flex">
        {/* Main Grid */}
        <main className="py-12 px-6 w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              layout
              transition={{ layout: { type: "spring", stiffness: 100, damping: 60 } }}
              className="flex flex-col items-center gap-y-4"
              data-testid="plant-grid"
              style={{ width: "100%", maxWidth: "680px" }}
            >
              {Array.from({ length: Math.ceil(plants.length / 10) }).map((_, rowIdx) => {
                const rowPlants = plants.slice(rowIdx * 10, rowIdx * 10 + 10);
                const containsHovered =
                  hoveredPlant && rowPlants.some((p) => p.id === hoveredPlant.id);

                return (
                  <div key={rowIdx} className="w-full">
                    <div className="flex justify-center gap-x-2">
                      {rowPlants.map((plant, idx) => (
                        <PlantCell
                          key={plant.id}
                          plant={plant}
                          index={rowIdx * 10 + idx}
                          isSelected={selectedPlants.some((p) => p.id === plant.id)}
                          isHovered={hoveredPlant?.id === plant.id}
                          onSelect={handleSelect}
                          onHover={handleHover}
                          mousePositionRef={mousePositionRef}
                        />
                      ))}
                    </div>

                    {containsHovered && (
                      <div className="mt-2 p-4 border border-botanical-light bg-white text-xs">
                        <div className="text-sm font-medium mb-1">
                          {hoveredPlant.korean}{" "}
                          <span className="italic text-botanical-medium">
                            ({hoveredPlant.scientific})
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div>생활형: {hoveredPlant.lifeForm}</div>
                          <div>최대높이: {hoveredPlant.maxHeight} m</div>
                          <div>근계 깊이: {hoveredPlant.rootDepth}</div>
                          <div>광요구도: {hoveredPlant.lightNeed}/5</div>
                          <div>수명: {hoveredPlant.lifespan} 년</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </main>

        {/* Slide-in SidePanel */}
        <SidePanel
          selectedPlants={selectedPlants}
          isVisible={selectedPlants.length > 0}
          onClear={clearSelection}
        />
      </div>
    </div>
  );
}
