export async function POST(req: Request) {
  try {
    const users = await req.json();
    const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
    const RELAYER_URL = isDev
      ? 'https://datil-test-relayer.getlit.dev/add-users'
      : 'https://datil-relayer.getlit.dev/add-users';

    const headers = {
      'api-key': process.env.LIT_RELAYER_API_KEY,
      'payer-secret-key': process.env.LIT_PAYER_SECRET_KEY,
      'Content-Type': 'application/json',
    };

    const response = await fetch(RELAYER_URL, {
      method: 'POST',
      headers: headers as Record<string, string>,
      body: JSON.stringify(users),
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to add users to Lit Relayer' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in Lit Relayer API:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
