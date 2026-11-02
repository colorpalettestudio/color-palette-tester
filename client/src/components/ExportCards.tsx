import { type ColorPair } from "./ColorPairTable";
import { rgbToHex } from "@/lib/colorUtils";

interface ExportCardsProps {
  pairs: ColorPair[];
  favorites: Set<string>;
}

export default function ExportCards({ pairs, favorites }: ExportCardsProps) {
  const favoritePairs = pairs.filter(pair => favorites.has(pair.id));

  return (
    <div 
      id="export-cards" 
      className="bg-white p-8"
      style={{ width: '1200px' }}
    >
      <div className="grid grid-cols-3 gap-6">
        {favoritePairs.map((pair) => {
          const textHex = rgbToHex(pair.foreground);
          const bgHex = rgbToHex(pair.background);
          
          return (
            <div 
              key={pair.id}
              className="rounded-lg overflow-hidden"
              style={{
                border: '2px solid #2d3748',
              }}
            >
              {/* Header */}
              <div 
                className="px-6 py-8 flex items-center justify-center"
                style={{ backgroundColor: bgHex }}
              >
                <div className="text-center">
                  <div 
                    className="text-lg font-bold tracking-wide"
                    style={{ color: textHex }}
                  >
                    FAVORITE
                  </div>
                  <div 
                    className="text-lg font-bold tracking-wide"
                    style={{ color: textHex }}
                  >
                    PAIRING
                  </div>
                </div>
              </div>
              
              {/* Body */}
              <div className="px-6 py-8 bg-white space-y-6">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Text:</div>
                  <div className="text-sm text-gray-700">{textHex}</div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Background:</div>
                  <div className="text-sm text-gray-700">{bgHex}</div>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
