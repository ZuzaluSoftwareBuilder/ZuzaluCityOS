export const registerPayer = async () => {
  try {
    const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
    const RELAYER_URL = isDev
      ? 'https://datil-test-relayer.getlit.dev/register-payer'
      : 'https://datil-relayer.getlit.dev/register-payer';

    const headers = {
      'api-key': process.env.LIT_RELAYER_API_KEY!,
      'Content-Type': 'application/json',
    };

    const response = await fetch(RELAYER_URL, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${await response.text()}`);
    }

    const { payerWalletAddress, payerSecretKey } = await response.json();

    // 保存这些值到环境变量或数据库
    console.log('Payer Wallet Address:', payerWalletAddress);
    console.log('Payer Secret Key:', payerSecretKey);

    return { payerWalletAddress, payerSecretKey };
  } catch (error) {
    console.error('Error registering payer:', error);
    throw error;
  }
};
