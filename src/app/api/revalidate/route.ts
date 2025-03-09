import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Types for Sanity webhook payload
type SanityDocument = {
  _type: string;
  _id: string;
  slug?: { current: string };
};

type WebhookPayload = {
  _type: 'created' | 'updated' | 'deleted';
  _id: string;
  operation: string;
  result: SanityDocument;
};

export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Get and validate the webhook payload
    const body = (await req.json()) as WebhookPayload;
    
    if (!body?._type || !body?.result) {
      console.error('Invalid webhook payload', body);
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Revalidate based on the document type
    switch (body.result._type) {
      case 'event':
        // Revalidate all event-related tags
        revalidateTag('events');
        revalidateTag('event');
        
        // If we have a slug, revalidate that specific event
        if (body.result.slug?.current) {
          revalidateTag(`event-${body.result.slug.current}`);
        }
        break;
      
      // Add other document types as needed
      default:
        // Revalidate everything if we're not sure
        revalidateTag('events');
        revalidateTag('event');
    }

    console.log(`Revalidated ${body.result._type} content`, {
      documentId: body.result._id,
      type: body.result._type,
      operation: body.operation
    });

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      document: body.result._id,
      type: body.result._type
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 