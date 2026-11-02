import { useState } from 'react';
import HeroSection from '../HeroSection';
import { colorsFromInput } from '@/lib/paletteStorage';

export default function HeroSectionExample() {
  const [input, setInput] = useState("#000000 #ffffff");

  return (
    <div className="p-8">
      <HeroSection
        onSampleClick={() => "#000000 #ffffff"}
        colors={colorsFromInput(input)}
        bulkInput={input}
        onInputChange={setInput}
      />
    </div>
  );
}
