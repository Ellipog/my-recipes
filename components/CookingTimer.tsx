import React, { useState, useEffect } from "react";

interface CookingTimerProps {
  duration: number;
}

export default function CookingTimer({ duration }: CookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "No waiting time";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      setTimeLeft(duration);
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            new Audio("/audio/alarm.mp3").play().catch(() => {});
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, duration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div
      onClick={toggleTimer}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-200
        ${
          isRunning
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
            : "bg-gray-700/50 text-blue-400 hover:bg-gray-700/70 border border-gray-700/50"
        }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isRunning ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </>
        )}
      </svg>
      <span className="text-sm font-medium">
        {isRunning ? formatTime(timeLeft) : formatTime(duration)}
      </span>
    </div>
  );
}
