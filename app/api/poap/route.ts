import { NextRequest, NextResponse } from 'next/server';

const poapApiKey = process.env.POAP_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const offset = searchParams.get('offset') || 0;

  const response = await fetch(
    `https://api.poap.tech/paginated-events?name=${name}&id=${name}&limit=100&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': poapApiKey!,
      },
    },
  );

  const data = await response.json();

  return NextResponse.json({ data });
}
