import { useCallback } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import { useSettingsStore } from '../store/settingsStore';

const messages = { fr, en };

export function useTranslation() {
    const { language } = useSettingsStore();

    const t = useCallback((key: string) => {
        const keys = key.split('.');
        let value: any = messages[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if translation missing
            }
        }

        return value;
    }, [language]);

    return { t, language };
}
