export const mintCapacityCredits = async (amount: number) => {
  try {
    const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
    const RELAYER_URL = isDev
      ? 'https://datil-test-relayer.getlit.dev/mint-capacity-credits'
      : 'https://datil-relayer.getlit.dev/mint-capacity-credits';

    const headers = {
      'api-key': process.env.LIT_RELAYER_API_KEY!,
      'payer-secret-key': process.env.LIT_PAYER_SECRET_KEY!,
      'Content-Type': 'application/json',
    };

    const response = await fetch(RELAYER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Error minting credits: ${await response.text()}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error minting capacity credits:', error);
    throw error;
  }
};
