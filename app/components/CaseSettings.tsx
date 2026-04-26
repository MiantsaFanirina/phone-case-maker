'use client';

import { useStore } from '../store';

export default function CaseSettings() {
  const { caseColor, caseFinish, setCaseColor, setCaseFinish } = useStore();

  const colors = [
    { name: 'Lavender', value: '#DFCEEA' },
    { name: 'Mist Blue', value: '#96AED1' },
    { name: 'Sage', value: '#A9B689' },
    { name: 'Black', value: '#353839' },
    { name: 'White', value: '#F5F5F5' },
  ];

  const finishes = [
    { name: 'Glossy', value: 'glossy', description: 'Shiny, reflective' },
    { name: 'Matte', value: 'matte', description: 'Smooth, non-reflective' },
    { name: 'Rubber', value: 'rubber', description: 'Soft, grippy' },
  ];

  return (
    <div className="panel-section">
      <div className="section-title">Case Settings</div>
      
      <div className="slider-group">
        <div className="slider-label">
          <span className="slider-name">Color</span>
        </div>
        <div className="color-options">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`color-btn ${caseColor === color.value ? 'active' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setCaseColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      <div className="slider-group">
        <div className="slider-label">
          <span className="slider-name">Finish</span>
        </div>
        <div className="finish-options">
          {finishes.map((finish) => (
            <button
              key={finish.value}
              className={`finish-btn ${caseFinish === finish.value ? 'active' : ''}`}
              onClick={() => setCaseFinish(finish.value)}
            >
              {finish.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}