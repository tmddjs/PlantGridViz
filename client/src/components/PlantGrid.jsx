import { useState, useEffect, useRef } from "react";
import plantsData from "../../../shared/plantsData.ts";
import { runLayout } from "../api/runLayout.ts";
import PlantCell from "./PlantCell.jsx";
import SidePanel from "./SidePanel.jsx";
import { motion, AnimatePresence } from "framer-motion";
export default function PlantGrid() {
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [hoveredPlant, setHoveredPlant] = useState(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const HOVER_OPEN_DELAY = 100;
  const HOVER_CLOSE_DELAY = 100;
  const PANEL_WIDTH = 320; // Side panel width (w-80)
  const CELL_TOTAL_WIDTH = 70; // Cell width including gap
  const [columns, setColumns] = useState(10);

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

  const updateColumns = () => {
    const availableWidth =
      window.innerWidth - (selectedPlants.length > 0 ? PANEL_WIDTH : 0);
    const maxCols = Math.floor(availableWidth / CELL_TOTAL_WIDTH);
    setColumns(Math.max(1, Math.min(10, maxCols)));
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [selectedPlants.length]);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);
  const clearSelection = () => setSelectedPlants([]);

  const handleRunLayout = async () => {
    try {
      const inputs = selectedPlants.map(({ id, ...rest }) => rest);
      const result = await runLayout(inputs);
      console.log("Layout result", result);
    } catch (err) {
      console.error("Failed to run layout", err);
    }
  };

  return (
    <div className="font-crimson text-botanical-dark min-h-screen bg-white">
      {/* ───── Header ───── */}
      <header
        className="py-8 px-6 border-b border-botanical-light text-center transition-all duration-300"
        style={{
          width: selectedPlants.length > 0 ? 'calc(100% - 20rem)' : '100%',
          marginRight: 'auto',
        }}
      >
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
        {selectedPlants.length > 0 && (
          <button
            onClick={handleRunLayout}
            className="mt-2 px-2 py-1 border border-botanical-light text-xs"
          >
            Run Layout
          </button>
        )}
      </header>

      <div className="flex">
        {/* Main Grid */}
        <main
          className="py-12 px-6 transition-all duration-300"
          style={{
            width: selectedPlants.length > 0 ? 'calc(100% - 20rem)' : '100%',
            marginRight: 'auto',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="flex flex-col items-center gap-y-4"
              data-testid="plant-grid"
              style={{ width: '100%', maxWidth: `${columns * CELL_TOTAL_WIDTH}px` }}
            >
              {Array.from({ length: Math.ceil(plants.length / columns) }).map((_, rowIdx) => {
                const rowPlants = plants.slice(rowIdx * columns, rowIdx * columns + columns);
                const containsHovered =
                  hoveredPlant && rowPlants.some((p) => p.id === hoveredPlant.id);

                return (
                  <motion.div
                    key={rowIdx}
                    className="w-full"
                    layout
                    transition={{ layout: { type: "spring", stiffness: 200, damping: 30 } }}
                  >
                    <div className="flex justify-center gap-x-2">
                      {rowPlants.map((plant, idx) => (
                        <PlantCell
                          key={plant.id}
                          plant={plant}
                          index={rowIdx * columns + idx}
                          isSelected={selectedPlants.some((p) => p.id === plant.id)}
                          isHovered={hoveredPlant?.id === plant.id}
                          onSelect={handleSelect}
                          onHover={handleHover}
                          mousePositionRef={mousePositionRef}
                        />
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {containsHovered && (
                        <motion.div
                          key="details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 60 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="mt-2 p-4 border border-botanical-light bg-white text-xs">
                            <div className="text-sm font-medium mb-1">
                              {hoveredPlant.kr_name}{" "}
                              <span className="italic text-botanical-medium">
                                ({hoveredPlant.scientific_name})
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <div>생활형: {hoveredPlant.life_form}</div>
                              <div>최대높이: {hoveredPlant.max_height_m} m</div>
                              <div>근계 깊이: {hoveredPlant.root_depth_cm_range}</div>
                              <div>광요구도: {hoveredPlant.light_requirement_1_5}/5</div>
                              <div>수명: {hoveredPlant.lifespan_yr} 년</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
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
