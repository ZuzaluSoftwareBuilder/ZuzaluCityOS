import { NextRequest, NextResponse } from 'next/server';

const poapApiKey = process.env.POAP_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const id = searchParams.get('id');

  const response = await fetch(
    `https://api.poap.tech/actions/scan/${address?.toLocaleLowerCase()}/${id}`,
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
