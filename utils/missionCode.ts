const ADJECTIVES = [
    'SHADOW', 'IRON', 'GHOST', 'NEON', 'CYBER', 'VOID', 'DARK', 'SILENT', 'ROGUE', 'PRIME',
    'STEALTH', 'OMEGA', 'ALPHA', 'ECHO', 'BRAVO', 'TANGO', 'SIERRA', 'VECTOR'
];

const NOUNS = [
    'PROTOCOL', 'BLADE', 'FOX', 'DOG', 'HAWK', 'EAGLE', 'SNAKE', 'WOLF', 'BEAR', 'TIGER',
    'ZERO', 'ONE', 'NINE', 'STORM', 'WINTER', 'SUMMER', 'NIGHT', 'MOON', 'SUN', 'STAR'
];

export function generateMissionCode(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(Math.random() * 99).toString().padStart(2, '0');

    return `${adj}-${noun}-${number}`;
}
