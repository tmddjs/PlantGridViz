import { Plant } from "@shared/schema";

interface PlantCellProps {
  plant: Plant;
  index: number;
  isSelected: boolean;
  onSelect: (plant: Plant, isMultiSelect: boolean) => void;
  onShowDetail: (plant: Plant) => void;
}

export default function PlantCell({ plant, index, isSelected, onSelect, onShowDetail }: PlantCellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      onSelect(plant, true);
    } else {
      onShowDetail(plant);
    }
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
      className={`plant-cell w-8 h-8 border border-botanical-light flex items-center justify-center relative cursor-pointer transition-all duration-300 ease-out hover:shadow-sm ${
        isSelected ? 'border-botanical-accent border-opacity-80' : ''
      }`}
      onClick={handleClick}
      data-testid={`plant-cell-${index}`}
    >
      <div className={`plant-shape transition-transform duration-300 ease-out hover:scale-130 ${getShapeClass()}`} />
    </div>
  );
}
