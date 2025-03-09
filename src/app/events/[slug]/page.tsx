import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { defineQuery, PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventStatus from "@/app/components/EventStatus";
import VenueMap from "@/app/components/VenueMap";
import ShareButtons from "@/app/components/ShareButtons";
import WeatherForecast from "@/app/components/WeatherForecast";
import PriceIndicator from "@/app/components/PriceIndicator";

const EVENT_QUERY = defineQuery(`{
  "event": *[_type == "event" && slug.current == $slug][0]{
  ...,
  "date": coalesce(date, now()),
  "doorsOpen": coalesce(doorsOpen, 0),
  headline->,
    venue->,
    ticketsPrice,
    partyLocation
  },
  "relatedEvents": *[_type == "event" && slug.current != $slug && date > now()] | order(date asc)[0...3]{
    _id,
    name,
    slug,
    date,
    image,
    eventType,
    ticketsPrice
  }
}`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// Related events component
function RelatedEvents({ events }: { events: any[] }) {
  if (!events?.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        More Events You Might Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link 
            href={`/events/${event.slug.current}`}
            key={event._id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-video">
              <Image
                src={urlFor(event.image)?.width(400).height(225).url() || "https://placehold.co/400x225/png"}
                alt={event.name}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                fill
              />
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-2">
                {new Date(event.date).toLocaleDateString()}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                {event.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { data } = await sanityFetch({
    query: EVENT_QUERY,
    params: resolvedParams,
    tags: [`event-${resolvedParams.slug}`, 'event']
  });
  
  if (!data?.event) {
    notFound();
  }

  const {
    name,
    date,
    headline,
    image,
    details,
    eventType,
    doorsOpen,
    venue,
    tickets,
    ticketsPrice,
    partyLocation,
  } = data.event;
  const eventImageUrl = image
    ? urlFor(image)?.width(550).height(310).url()
    : null;
  const eventDate = new Date(date).toDateString();
  const eventTime = new Date(date).toLocaleTimeString();
  const doorsOpenTime = new Date(
    new Date(date).getTime() - doorsOpen * 60000
  ).toLocaleTimeString();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>Back to events</span>
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={eventImageUrl || "https://placehold.co/550x310/png"}
          alt={name || "Event"}
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {eventType && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-900">
                {eventType.replace("-", " ")}
                </span>
              )}
            </div>
            
            {details && details.length > 0 && (
              <div className="prose max-w-none bg-white p-8 rounded-2xl shadow-sm">
                <PortableText value={details} />
              </div>
            )}

            {venue && (
              <VenueMap venue={venue} location={partyLocation} />
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              {name && (
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {name}
              </h1>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <EventStatus date={date} />
                  {ticketsPrice && <PriceIndicator price={ticketsPrice} />}
                </div>

                {headline?.name && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl">
                      {headline.name[0]}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Headline Artist</p>
                      <p className="font-semibold">{headline.name}</p>
                    </div>
                </div>
                )}

                <div className="grid gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                    <p className="font-semibold">{eventDate}</p>
                    <p className="text-gray-600">{eventTime}</p>
                </div>

                  {doorsOpenTime && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Doors Open</p>
                      <p className="font-semibold">{doorsOpenTime}</p>
          </div>
                  )}

                  {venue?.name && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Venue</p>
                      <p className="font-semibold">{venue.name}</p>
            </div>
          )}

                  {venue && (
                    <WeatherForecast date={date} location={partyLocation} />
                  )}
                </div>

          {tickets && (
                  <div className="space-y-4 pt-4">
            <a
              href={tickets}
                      className="block w-full py-4 px-6 text-center font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Tickets
                    </a>
                    
                    <div className="flex justify-center gap-6 text-sm">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(new Date(date).getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(details?.[0]?.children?.[0]?.text || '')}&location=${encodeURIComponent(partyLocation || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-500 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>📅</span> Google Calendar
                      </a>
                      <a
                        href={`webcal://calendar.ics?event=${encodeURIComponent(JSON.stringify({
                          title: name,
                          description: details?.[0]?.children?.[0]?.text || '',
                          location: partyLocation || '',
                          start: date,
                          duration: '1:00'
                        }))}`}
                        className="text-gray-600 hover:text-blue-500 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>📅</span> iCal
                      </a>
                    </div>
                  </div>
                )}

                <ShareButtons 
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={name || 'Event'} 
                />
              </div>
            </div>
          </div>
        </div>

        {data.relatedEvents && <RelatedEvents events={data.relatedEvents} />}
      </div>
    </main>
  );
}