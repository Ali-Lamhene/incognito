import { Agent } from '../context/SessionContext';

export const AVATAR_COLORS = [
    '#4F2B79', // Muted purple (Bêta style)
    '#8B5E1E', // Muted orange/gold (Alpha style)
    '#1E3E62', // Muted blue (Gamma style)
    '#1C4A28', // Muted green (Delta style)
    '#6B2D2D', // Muted dark red
    '#2D4A6B', // Muted slate blue
    '#3B5B3B', // Muted olive green
    '#6B522D', // Muted bronze/brown
    '#4A2D6B', // Muted purple
    '#2D6B5B', // Muted teal
    '#6B402D', // Muted rust
    '#454552', // Slate grey
    '#54384A', // Muted plum
    '#3D4A3D', // Forest drab
    '#5A4D3D', // Khaki
    '#2C3E50', // Midnight blue
    '#4E342E', // Chocolate brown
    '#37474F', // Blue grey
    '#424242', // Dark grey
];

export function getAgentColor(agentId: string, allAgents: Agent[]): string {
    if (!agentId || !allAgents || allAgents.length === 0) {
        return AVATAR_COLORS[0];
    }
    // Sort all agents by id to get a stable sorted list
    const sorted = [...allAgents].sort((a, b) => a.id.localeCompare(b.id));
    const index = sorted.findIndex(a => a.id === agentId);
    if (index === -1) return AVATAR_COLORS[0];
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
}
