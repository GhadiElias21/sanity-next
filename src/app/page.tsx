import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

interface Event {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  ticketsPrice: number;
  image?: any;
  eventType?: string;
  venue?: {
    name: string;
  };
  headline?: {
    name: string;
  };
}

const EVENTS_QUERY = defineQuery(`*[
  _type == "event"
  && defined(slug.current)
]{
  _id, 
  name, 
  slug, 
  date,
  ticketsPrice,
  image,
  eventType,
  venue->,
  headline->
}|order(date asc)`);

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

function EventCard({ event }: { event: Event }) {
  const eventImageUrl = event.image
    ? urlFor(event.image)?.width(400).height(225).url() || "https://placehold.co/400x225/png"
    : "https://placehold.co/400x225/png";

  return (
    <Link
      href={`/events/${event?.slug?.current}`}
      className="group dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-video">
        <Image
          src={eventImageUrl}
          alt={event?.name}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {event.eventType && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900">
            {event.eventType.replace("-", " ")}
          </span>
        )}
        <EventStatus date={event.date} />
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

function FilterBar({ 
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  eventTypes 
}: { 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  eventTypes: string[];
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
        />
        <svg
          className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        <button
          onClick={() => setSelectedType("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === ""
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Events
        </button>
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {type.replace("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour

export default async function IndexPage() {
  const { data: events } = await sanityFetch({ 
    query: EVENTS_QUERY,
    tags: ['events'] // Add tag for revalidation
  });
  
  // Get unique event types
  const eventTypes = Array.from(new Set(events.map((event: Event) => event.eventType).filter(Boolean)));

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Find and book tickets for the best concerts, parties, and performances in your area.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Client-side FilterBar will be added here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: Event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-300">No events found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
