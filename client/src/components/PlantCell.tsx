import { Plant } from "@shared/schema";
import { useState, useRef, useEffect, useMemo } from "react";

interface PlantCellProps {
  plant: Plant;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (plant: Plant) => void;
  onHover: (plant: Plant | null, index?: number) => void;
  mousePosition: { x: number; y: number } | null;
}

export default function PlantCell({ plant, index, isSelected, isHovered, onSelect, onHover, mousePosition }: PlantCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const scaledStyle = useMemo(() => {
    if (!isHovered) {
      return {
        transform: 'scale(1)',
        transformOrigin: 'center',
        margin: '1px',
        zIndex: 1,
        minWidth: '60px',
        flexBasis: '60px'
      };
    }

    return {
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      margin: scale > 1.1 ? `${(scale - 1) * 8}px` : '1px',
      zIndex: 20,
      minWidth: '60px',
      flexBasis: '60px',
      willChange: 'transform'
    };
  }, [scale, isHovered]);

  useEffect(() => {
    if (isHovered && mousePosition && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const cellCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - cellCenter.x, 2) + 
        Math.pow(mousePosition.y - cellCenter.y, 2)
      );
      
      const maxDistance = 80;
      const proximityScale = Math.max(0, 1 - distance / maxDistance);
      const newScale = 1 + (proximityScale * 1.0);
      setScale(newScale);
    }
  }, [mousePosition, isHovered]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isHovered) {
      onSelect(plant);
    }
  };

  const handleMouseEnter = () => {
    onHover(plant, index);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  const getShapeClass = () => {
    switch (plant.lifeForm) {
      case '교목':
        return 'w-3 h-3 bg-botanical-accent rounded-full opacity-80';
      case '관목':
        return 'w-2.5 h-2.5 bg-botanical-medium opacity-70';
      case '초화':
        return 'w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-botanical-border opacity-60';
      default:
        return 'w-2 h-2 bg-gray-400 rounded-full';
    }
  };

  return (
    <div
      ref={cellRef}
      className={`plant-cell flex flex-col items-center justify-center relative cursor-pointer transition-transform duration-100 ease-out ${
        isSelected ? 'opacity-100' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`plant-cell-${index}`}
      style={scaledStyle}
    >
      <div className={`plant-shape ${getShapeClass()}`} />
      <div className="mt-2 text-center">
        <div className="text-[8px] font-medium text-botanical-dark leading-tight">{plant.korean}</div>
        <div className="text-[6px] italic text-botanical-medium leading-tight mt-0.5">{plant.scientific}</div>
      </div>
    </div>
  );
}
