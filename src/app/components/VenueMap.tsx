'use client';

interface VenueMapProps {
  venue: {
    name: string;
  };
  location?: string;
}

export default function VenueMap({ venue, location }: VenueMapProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div className="aspect-video relative">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute' }}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${encodeURIComponent(location || venue.name)}`}
          allowFullScreen
        />
      </div>
      <div className="bg-white p-4">
        <h3 className="font-semibold mb-2">Getting There</h3>
        <p className="text-sm text-gray-600 mb-2">
          {venue.name}
        </p>
        {location && (
          <p className="text-sm text-gray-600">
            {location}
          </p>
        )}
      </div>
    </div>
  );
} 