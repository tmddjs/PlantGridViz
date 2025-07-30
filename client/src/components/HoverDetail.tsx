import { Plant } from "@shared/schema";

interface HoverDetailProps {
  plant: Plant | null;
  isVisible: boolean;
}

export default function HoverDetail({ plant, isVisible }: HoverDetailProps) {
  if (!plant) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-botanical-border transition-all duration-300 ease-out z-50 ${
      isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className={`${
                  plant.lifeForm === '교목' ? 'w-3 h-3 bg-botanical-accent rounded-full opacity-80' :
                  plant.lifeForm === '관목' ? 'w-2.5 h-2.5 bg-botanical-medium opacity-70' :
                  'w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-botanical-border opacity-60'
                }`} />
                <div>
                  <h3 className="text-base font-semibold text-botanical-dark">{plant.korean}</h3>
                  <p className="text-sm italic text-botanical-medium">{plant.scientific}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-6 text-xs">
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
          </div>
          
          <div className="text-xs text-botanical-medium">
            클릭하여 선택
          </div>
        </div>
      </div>
    </div>
  );
}