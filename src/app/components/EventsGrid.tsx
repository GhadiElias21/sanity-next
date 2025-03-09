'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import EventCard from '@/app/components/EventCard';
import FilterBar from '@/app/components/FilterBar';

interface EventsGridProps {
  events: Event[];
  eventTypes: string[];
}

export default function EventsGrid({ events, eventTypes }: EventsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.venue?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.headline?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || event.eventType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedType]);

  return (
    <>
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        eventTypes={eventTypes}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No events found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </>
  );
} 