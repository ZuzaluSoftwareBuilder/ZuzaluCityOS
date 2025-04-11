import { isDev } from '@/constant';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const baseUrl = isDev
      ? `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
      : `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return Response.json(await response.json());
  } catch (error) {
    return Response.json({ error: 'RPC Error' }, { status: 500 });
  }
}
