import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

interface TargetIconProps {
  size?: number;
  color?: string;
  style?: any;
}

export function TargetIcon({ size = 22, color = '#F2E8CF', style }: TargetIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      {/* Outer target circle */}
      <Circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth="1.5"
      />

      {/* Center dot */}
      <Circle
        cx="12"
        cy="12"
        r="1.5"
        fill={color}
      />

      {/* Horizontal & Vertical lines (0, 90, 180, 270 degrees) */}
      <Line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="6" y1="12" x2="2" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="6" x2="12" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
