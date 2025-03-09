'use client';

interface EventStatusProps {
  date: string;
}

export default function EventStatus({ date }: EventStatusProps) {
  const eventDate = new Date(date);
  const now = new Date();
  const isOngoing = eventDate.getDate() === now.getDate() && 
                    eventDate.getMonth() === now.getMonth() && 
                    eventDate.getFullYear() === now.getFullYear();
  const isPast = eventDate < now;

  if (isOngoing) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
        Happening Now
      </span>
    );
  }

  if (isPast) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Finished
      </span>
    );
  }

  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
    </span>
  );
} 