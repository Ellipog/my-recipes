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
    <>
      <span className="inline-block bg-gray-700 px-2 py-1 rounded">
        {isRunning ? formatTime(timeLeft) : formatTime(duration)}
      </span>
      <button
        onClick={toggleTimer}
        className={`px-2 py-1 rounded ${
          isRunning
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isRunning ? "Stop" : "Start Timer"}
      </button>
    </>
  );
}
