import { useCallback, useEffect, useRef, useState } from 'react';

export const useOtpTimer = () => {
    const [timeLeft, setTimeLeft] = useState(120); // 120 seconds
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = useCallback(() => {
        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        // Reset time to 120s
        setTimeLeft(120);
        // Start new timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, []);

    // Initial timer setup and cleanup
    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTimer]);

    return {
        timeLeft,
        startTimer,
        canResend: timeLeft === 0
    };
}
