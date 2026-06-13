import { Theme } from './Theme';

export const Colors = {
    light: {
        text: Theme.colors.text.dark,
        background: Theme.colors.paper,
        primary: Theme.colors.red,
        secondary: Theme.colors.text.muted,
        accent: Theme.colors.accentGold,
        border: Theme.colors.border,
    },
    dark: {
        text: Theme.colors.text.light,
        background: Theme.colors.background,
        primary: Theme.colors.red,
        secondary: Theme.colors.border,
        accent: Theme.colors.accentGold,
        surface: Theme.colors.surface,
        border: Theme.colors.border,
        success: Theme.colors.status.online,
    },
};

