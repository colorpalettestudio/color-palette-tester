import { useState } from 'react';
import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  const [colorInput, setColorInput] = useState('');
  const [wcagLevel, setWcagLevel] = useState('aa-small');

  return (
    <div className="p-8">
      <HeroSection
        onTestClick={() => console.log('Test clicked')}
        onSampleClick={() => console.log('Sample clicked')}
        colorInput={colorInput}
        onColorInputChange={setColorInput}
        wcagLevel={wcagLevel}
        onWcagLevelChange={setWcagLevel}
      />
    </div>
  );
}
