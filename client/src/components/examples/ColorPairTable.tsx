import { useState } from 'react';
import ColorPairTable from '../ColorPairTable';

export default function ColorPairTableExample() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [wcagLevel, setWcagLevel] = useState('all');

  const mockPairs = [
    {
      id: '1',
      foreground: { r: 255, g: 111, b: 97 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 8.5,
      passes: true,
    },
    {
      id: '2',
      foreground: { r: 253, g: 214, b: 111 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 12.2,
      passes: true,
    },
    {
      id: '3',
      foreground: { r: 142, g: 214, b: 169 },
      background: { r: 17, g: 24, b: 39 },
      ratio: 10.5,
      passes: true,
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
        threshold={4.5}
        textSize="small"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        wcagLevel={wcagLevel}
        onWcagLevelChange={setWcagLevel}
      />
    </div>
  );
}
