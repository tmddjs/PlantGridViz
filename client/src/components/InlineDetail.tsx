import { Plant } from "@shared/schema";

interface InlineDetailProps {
  plant: Plant | null;
  isVisible: boolean;
  gridIndex: number;
}

export default function InlineDetail({ plant, isVisible, gridIndex }: InlineDetailProps) {
  if (!plant || !isVisible) return null;

  // Calculate position in grid (10 columns)
  const row = Math.floor(gridIndex / 10);
  const col = gridIndex % 10;
  
  // Insert after the current row
  const insertAfterRow = row;
  
  return (
    <div 
      className="col-span-10 bg-gray-50/80 border border-botanical-light transition-all duration-300 ease-out p-4"
      style={{ 
        gridRow: `${insertAfterRow + 2}`,
        gridColumn: '1 / -1'
      }}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 mt-1 ${
          plant.lifeForm === '교목' ? 'w-4 h-4 bg-botanical-accent rounded-full opacity-80' :
          plant.lifeForm === '관목' ? 'w-3 h-3 bg-botanical-medium opacity-70' :
          'w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-botanical-border opacity-60'
        }`} />
        
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-botanical-dark">{plant.korean}</h3>
            <p className="text-xs italic text-botanical-medium">{plant.scientific}</p>
          </div>
          
          <div className="grid grid-cols-5 gap-4 text-xs">
            <div>
              <span className="text-botanical-medium block mb-1">생활형</span>
              <span className="font-medium">{plant.lifeForm}</span>
            </div>
            <div>
              <span className="text-botanical-medium block mb-1">최대 높이</span>
              <span className="font-medium">{plant.maxHeight}m</span>
            </div>
            <div>
              <span className="text-botanical-medium block mb-1">뿌리 깊이</span>
              <span className="font-medium">{plant.rootDepth}cm</span>
            </div>
            <div>
              <span className="text-botanical-medium block mb-1">필요 광량</span>
              <span className="font-medium">{plant.lightNeed}/5</span>
            </div>
            <div>
              <span className="text-botanical-medium block mb-1">전형 수명</span>
              <span className="font-medium">{plant.lifespan}년</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-botanical-medium">
            클릭하여 선택
          </div>
        </div>
      </div>
    </div>
  );
}