import { registerPayer } from '../services/lit/registerPayer';

async function initLitProtocol() {
  try {
    // 1. 注册payer
    console.log('Registering payer...');
    const { payerWalletAddress, payerSecretKey } = await registerPayer();

    console.log('Initialization complete!');
    console.log('Please add these values to your .env file:');
    console.log(`LIT_PAYER_SECRET_KEY=${payerSecretKey}`);
    console.log(`LIT_PAYER_WALLET_ADDRESS=${payerWalletAddress}`);

    console.log(
      '\nIMPORTANT: You need to obtain Capacity Credits for your payer wallet.',
    );
    console.log(
      'Please visit Lit Protocol documentation for instructions on obtaining Credits.',
    );
  } catch (error) {
    console.error('Error initializing Lit Protocol:', error);
  }
}

// 运行初始化
initLitProtocol();
