export default function SidePanel({ selectedPlants, isVisible, onClear }) {
  if (!isVisible) return null;

  // Generate circular diagram positions
  const generateCircularPositions = (count) => {
    const positions = [];
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    return positions;
  };

  const positions = generateCircularPositions(selectedPlants.length);

  const getShapeElement = (plant, index) => {
    const pos = positions[index];
    const baseClass = "absolute transition-all duration-500 ease-out";
    
    switch (plant.life_form) {
      case '교목':
        return (
          <div
            key={`circle-${plant.id}`}
            className={`${baseClass} w-3 h-3 bg-botanical-accent rounded-full opacity-80`}
            style={{ left: `${pos.x - 6}px`, top: `${pos.y - 6}px` }}
          />
        );
      case '관목':
        return (
          <div
            key={`square-${plant.id}`}
            className={`${baseClass} w-2.5 h-2.5 bg-botanical-medium opacity-70`}
            style={{ left: `${pos.x - 5}px`, top: `${pos.y - 5}px` }}
          />
        );
      case '초화':
        return (
          <div
            key={`triangle-${plant.id}`}
            className={`${baseClass} w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-botanical-border opacity-60`}
            style={{ left: `${pos.x - 5}px`, top: `${pos.y - 9}px` }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white border-l border-botanical-border transition-transform duration-300 ease-out z-40 ${
      isVisible ? 'transform translate-x-0' : 'transform translate-x-full'
    }`}>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-botanical-dark">선택된 식생</h2>
          <button 
            onClick={onClear}
            className="text-xs text-botanical-medium hover:text-botanical-dark transition-colors"
            data-testid="clear-selection-side"
          >
            초기화
          </button>
        </div>

        {/* Circular Diagram */}
        <div className="mb-6">
          <div className="relative w-60 h-60 mx-auto border border-botanical-light rounded-full bg-gray-50/50">
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-light text-botanical-accent">{selectedPlants.length}</div>
                <div className="text-xs text-botanical-medium">선택된 종</div>
              </div>
            </div>
            
            {/* Plant shapes positioned in circle */}
            {selectedPlants.map((plant, index) => getShapeElement(plant, index))}
            
            {/* Connecting lines from center */}
            {positions.map((pos, index) => (
              <svg
                key={`line-${index}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.3 }}
              >
                <line
                  x1="120"
                  y1="120"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="var(--botanical-border)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Selected Plants List */}
        <div className="flex-1 overflow-auto">
          <h3 className="text-xs font-medium text-botanical-medium mb-3">구성 요소</h3>
          <div className="space-y-2">
            {selectedPlants.map((plant, index) => (
              <div
                key={`${plant.id}-${index}`}
                className="flex items-center space-x-3 p-2 border border-botanical-light bg-gray-50/50 rounded-sm"
              >
                <div className={`${
                  plant.life_form === '교목' ? 'w-2 h-2 bg-botanical-accent rounded-full' :
                  plant.life_form === '관목' ? 'w-2 h-2 bg-botanical-medium' :
                  'w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-botanical-border'
                }`} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-botanical-dark">{plant.kr_name}</div>
                  <div className="text-[10px] text-botanical-medium">{plant.max_height_m}m · {plant.life_form}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 pt-4 border-t border-botanical-light">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-light text-botanical-accent">
                {(selectedPlants.reduce((sum, p) => sum + p.max_height_m, 0) / selectedPlants.length).toFixed(1)}m
              </div>
              <div className="text-[10px] text-botanical-medium">평균 높이</div>
            </div>
            <div>
              <div className="text-sm font-light text-botanical-accent">
                {Math.round(selectedPlants.reduce((sum, p) => sum + p.lifespan_yr, 0) / selectedPlants.length)}
              </div>
              <div className="text-[10px] text-botanical-medium">평균 수명(년)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}