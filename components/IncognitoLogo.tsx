import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface IncognitoLogoProps {
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export function IncognitoLogo({ size = 80, color = "#FFFFFF", style }: IncognitoLogoProps) {
    return (
        <View style={style}>
            <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                {/* Binoculars Body - Left Lens */}
                <Circle
                    cx="30"
                    cy="55"
                    r="20"
                    stroke={color}
                    strokeWidth="6"
                />
                {/* Binoculars Body - Right Lens */}
                <Circle
                    cx="70"
                    cy="55"
                    r="20"
                    stroke={color}
                    strokeWidth="6"
                />

                {/* Connecting Bridge */}
                <Path
                    d="M45 45 Q50 40 55 45"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <Path
                    d="M35 35 L45 35 L50 25 L55 35 L65 35"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Central Adjustment Dial */}
                <Rect x="47" y="28" width="6" height="12" rx="2" fill={color} />

                {/* Optical Reflections (Simple slits for a glassy look) */}
                <Path
                    d="M22 45 A12 12 0 0 1 35 48"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.5"
                />
                <Path
                    d="M62 45 A12 12 0 0 1 75 48"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.5"
                />
            </Svg>
        </View>
    );
}
