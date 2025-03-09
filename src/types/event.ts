export interface Event {
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