import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { generateMissionCode } from '../utils/missionCode';
import { useTranslation } from './useTranslation';

export function useCreateMission() {
    const router = useRouter();
    const { createSession } = useSession();
    const { t } = useTranslation();

    // States
    const [duration, setDuration] = useState('CUSTOM');
    const [customDuration, setCustomDuration] = useState('20');
    const [terrain, setTerrain] = useState(1);

    // Validation
    const parsedCustomDuration = parseInt(customDuration, 10);
    const isCustomInvalid = duration === 'CUSTOM' && (isNaN(parsedCustomDuration) || parsedCustomDuration <= 0);

    const handleCreate = async () => {
        if (isCustomInvalid) return;

        const missionCode = generateMissionCode();
        const finalDuration = duration === 'CUSTOM' ? `${customDuration} MIN` : t(`mission.options.${duration}`);

        await createSession(missionCode, finalDuration, terrain);

        console.log("Mission Initialized:", { duration: finalDuration, missionCode, terrain });
        router.push(`/lobby/${missionCode}`);
    };

    return {
        duration,
        setDuration,
        customDuration,
        setCustomDuration,
        terrain,
        setTerrain,
        isCustomInvalid,
        handleCreate
    };
}
