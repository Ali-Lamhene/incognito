import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSession } from '../context/SessionContext';

export function useJoinMission() {
    const router = useRouter();
    const { checkSessionExists } = useSession();
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState(false);

    const handleJoin = async () => {
        if (manualCode.trim()) {
            const normalized = manualCode.trim().toUpperCase();
            const exists = await checkSessionExists(normalized);
            if (exists) {
                router.replace(`/lobby/${normalized}`);
            } else {
                setError(true);
                // Reset error after 2 seconds
                setTimeout(() => setError(false), 2000);
            }
        }
    };

    const handleScan = () => {
        router.push('/mission/scan');
    };

    const onChangeCode = (val: string) => {
        setManualCode(val);
        if (error) setError(false);
    };

    return {
        manualCode,
        onChangeCode,
        error,
        setError,
        handleJoin,
        handleScan
    };
}
