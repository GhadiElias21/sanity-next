'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) return null;

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="p-6 dark-card rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Time Until Event</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeUnits.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="relative">
              <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                <span className="text-3xl font-bold text-gray-100 relative z-10 animate-bounce-slow">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 