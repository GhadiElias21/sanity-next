import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Types for actual Sanity webhook payload
type SanityDocument = {
  _type: string;
  _id: string;
  slug?: { 
    _type: 'slug';
    current: string;
  };
  name?: string;
  [key: string]: any; // for other fields
};

export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Get the webhook payload
    const document = (await req.json()) as SanityDocument;
    
    if (!document?._type) {
      console.error('Invalid webhook payload', document);
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Revalidate based on the document type
    switch (document._type) {
      case 'event':
        // Revalidate all event-related tags
        console.log('Revalidating event tags');
        revalidateTag('events');
        revalidateTag('event');
        
        // If we have a slug, revalidate that specific event
        if (document.slug?.current) {
          console.log('Revalidating specific event:', document.slug.current);
          revalidateTag(`event-${document.slug.current}`);
        }
        break;
      
      // Add other document types as needed
      default:
        // Revalidate everything if we're not sure
        console.log('Revalidating all tags');
        revalidateTag('events');
        revalidateTag('event');
    }

    console.log('Revalidation successful:', {
      documentId: document._id,
      type: document._type,
      name: document.name,
      slug: document.slug?.current
    });

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      document: document._id,
      type: document._type,
      name: document.name
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 