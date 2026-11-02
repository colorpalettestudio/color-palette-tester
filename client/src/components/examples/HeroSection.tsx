import { useState } from 'react';
import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  const [colors, setColors] = useState([{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }]);

  return (
    <div className="p-8">
      <HeroSection
        onTestPalette={() => console.log('Test clicked')}
        onSampleClick={() => "#000000 #ffffff"}
        colors={colors}
        onColorsChange={setColors}
      />
    </div>
  );
}
