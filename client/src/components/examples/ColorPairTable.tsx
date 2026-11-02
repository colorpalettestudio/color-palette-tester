import { useState } from 'react';
import ColorPairTable, { type PairFilter } from '../ColorPairTable';

export default function ColorPairTableExample() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [pairFilter, setPairFilter] = useState<PairFilter>("all");
  const [fontSize, setFontSize] = useState(14);

  const mockPairs = [
    {
      id: '1',
      foreground: { r: 255, g: 111, b: 97 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 8.5,
    },
    {
      id: '2',
      foreground: { r: 253, g: 214, b: 111 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 12.2,
    },
    {
      id: '3',
      foreground: { r: 142, g: 214, b: 169 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 10.5,
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="p-8">
      <ColorPairTable
        pairs={mockPairs}
        pairFilter={pairFilter}
        onPairFilterChange={setPairFilter}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelectAll={() => setFavorites(previous => new Set([...Array.from(previous), ...mockPairs.filter(pair => pairFilter === "all" || pair.ratio >= pairFilter).map(pair => pair.id)]))}
        onClearFavorites={() => setFavorites(new Set())}
        previewFontSize={fontSize}
        onPreviewFontSizeChange={setFontSize}
      />
    </div>
  );
}
