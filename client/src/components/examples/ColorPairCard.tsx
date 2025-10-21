import { useState } from 'react';
import ColorPairCard from '../ColorPairCard';

export default function ColorPairCardExample() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="p-8 max-w-sm">
      <ColorPairCard
        foreground={{ r: 255, g: 111, b: 97 }}
        background={{ r: 17, g: 24, b: 39 }}
        ratio={8.5}
        threshold={4.5}
        textSize="small"
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />
    </div>
  );
}
