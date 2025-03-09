import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check for secret to confirm this is a valid request
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Get the body
    const body = await req.json();

    // Extract the path from the body - this is optional and depends on your needs
    // For now, we'll revalidate the home page and events pages
    revalidatePath('/');
    revalidatePath('/events/[slug]');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
} 