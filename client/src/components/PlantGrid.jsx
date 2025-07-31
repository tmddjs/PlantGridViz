import { useState, useEffect, useRef, useCallback } from "react";
import { plantsData } from "../data/plantsData.js";
import PlantCell from "./PlantCell.jsx";
import SidePanel from "./SidePanel.jsx";
import { motion, AnimatePresence } from "framer-motion";

const HOVER_OPEN_DELAY = 100;   // ms
const HOVER_CLOSE_DELAY = 100;
const PANEL_WIDTH = 320;        // px
const CELL_TOTAL_WIDTH = 70;    // px
const MAX_COLUMNS = 10;

export default function PlantGrid() {
  /* ───────── 상태 ───────── */
  const [selected, setSelected] = useState([]);
  const [hoverId, setHoverId]     = useState(null);      // ← ID 기반 hover
  const [columns, setColumns]     = useState(MAX_COLUMNS);

  /* ───────── 마우스 위치 추적 (프레임당 1회) ───────── */
  const pointRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef();

  const handleMouseMove = useCallback((e) => {
    pointRef.current = { x: e.clientX, y: e.clientY };

    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = undefined;

        // 포인터 아래에 있는 셀 찾아 hoverId 설정
        const btn = document
          .elementFromPoint(pointRef.current.x, pointRef.current.y)
          ?.closest("[data-plant-id]");
        setHoverId(btn ? btn.dataset.plantId : null);
      });
    }
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafIdRef.current), []);

  /* ───────── 선택 토글 ───────── */
  const toggleSelect = (plant) =>
    setSelected((prev) =>
      prev.some((p) => p.id === plant.id)
        ? prev.filter((p) => p.id !== plant.id)
        : [...prev, plant]
    );
  const clearSelection = () => setSelected([]);

  /* ───────── 컬럼 수 계산 ───────── */
  const updateColumns = useCallback(() => {
    const w = window.innerWidth - (selected.length ? PANEL_WIDTH : 0);
    const maxCols = Math.floor(w / CELL_TOTAL_WIDTH);
    setColumns(Math.max(1, Math.min(MAX_COLUMNS, maxCols)));
  }, [selected.length]);

  useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [updateColumns]);

  /* ───────── 데이터(ID 부여) ───────── */
  const plants = plantsData.map((d, i) => ({ id: `plant-${i + 1}`, ...d }));

  /* ───────── 렌더 ───────── */
  return (
    <div
      className="font-crimson text-botanical-dark min-h-screen bg-white"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <header
        className="py-8 px-6 border-b border-botanical-light text-center transition-all duration-300"
        style={{
          width: selected.length ? "calc(100% - 20rem)" : "100%",
          marginLeft: "auto",
        }}
      >
        <h1 className="text-lg mb-2">식생 컬렉션</h1>
        <p className="text-xs text-botanical-medium">
          Botanical Species Interactive Grid
        </p>
        <div className="mt-4 text-xs">
          선택된 항목&nbsp;
          <span className="font-semibold text-botanical-accent">
            {selected.length}
          </span>
          / 100
        </div>
      </header>

      <div className="flex">
        {/* Main Grid */}
        <main
          className={`py-12 px-6 w-full transition-all duration-300 ${
            selected.length ? "mr-80" : ""
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="flex flex-col items-center gap-y-4"
              style={{
                width: "100%",
                maxWidth: `${columns * CELL_TOTAL_WIDTH}px`,
              }}
            >
              {Array.from({ length: Math.ceil(plants.length / columns) }).map(
                (_, row) => {
                  const rowPlants = plants.slice(
                    row * columns,
                    row * columns + columns
                  );
                  const showDetails = rowPlants.some(
                    (p) => p.id === hoverId
                  );

                  return (
                    <motion.div
                      key={row}
                      className="w-full"
                      layout
                      transition={{
                        layout: { type: "spring", stiffness: 200, damping: 30 },
                      }}
                    >
                      <div className="flex justify-center gap-x-2">
                        {rowPlants.map((plant) => (
                          <PlantCell
                            key={plant.id}
                            plant={plant}
                            isSelected={selected.some(
                              (p) => p.id === plant.id
                            )}
                            isHovered={hoverId === plant.id}
                            onSelect={toggleSelect}
                          />
                        ))}
                      </div>

                      {/* 상세 정보 행 */}
                      <AnimatePresence initial={false}>
                        {showDetails && (
                          <motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 60,
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            {rowPlants
                              .filter((p) => p.id === hoverId)
                              .map((p) => (
                                <div
                                  key={p.id}
                                  className="mt-2 p-4 border border-botanical-light bg-white text-xs"
                                >
                                  <div className="text-sm font-medium mb-1">
                                    {p.korean}&nbsp;
                                    <span className="italic text-botanical-medium">
                                      ({p.scientific})
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <div>생활형: {p.lifeForm}</div>
                                    <div>최대높이: {p.maxHeight} m</div>
                                    <div>근계 깊이: {p.rootDepth}</div>
                                    <div>광요구도: {p.lightNeed}/5</div>
                                    <div>수명: {p.lifespan} 년</div>
                                  </div>
                                </div>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </main>

        {/* Slide-in SidePanel */}
        <SidePanel
          selectedPlants={selected}
          isVisible={selected.length > 0}
          onClear={clearSelection}
        />
      </div>
    </div>
  );
}
