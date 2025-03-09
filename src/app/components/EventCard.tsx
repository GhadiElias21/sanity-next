'use client';

import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/event";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const { projectId, dataset } = client.config();
const urlFor = (source: any) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

function EventStatus({ date }: { date: string }) {
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

export default function EventCard({ event }: { event: Event }) {
  const eventImageUrl = event.image
    ? urlFor(event.image)?.width(400).height(225).url() || "https://placehold.co/400x225/png"
    : "https://placehold.co/400x225/png";

  return (
    <Link
      href={`/events/${event?.slug?.current}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-video">
        <Image
          src={eventImageUrl}
          alt={event?.name || "Event"}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {event.eventType && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900">
            {event.eventType.replace("-", " ")}
          </span>
        )}
        <div className="absolute top-4 right-4">
          <EventStatus date={event.date} />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors mb-2">
          {event?.name}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={event.date}>
            {new Date(event.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        {event.venue && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue.name}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          {event.headline && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                {event.headline.name[0]}
              </div>
              <span className="text-sm text-gray-600">{event.headline.name}</span>
            </div>
          )}
          {event.ticketsPrice && (
            <span className="font-medium text-gray-900">
              ${event.ticketsPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
} 