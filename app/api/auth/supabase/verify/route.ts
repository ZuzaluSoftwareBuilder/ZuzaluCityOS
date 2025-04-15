import supabaseAdmin from '@/app/api/utils/supabase';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { ethers } from 'ethers';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const nonceSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Nonce is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = nonceSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { address, signature, message } = validationResult.data;
    const lowerCaseAddress = address.toLowerCase();

    console.log(`[API Verify] Verifying Nonce for ${lowerCaseAddress}...`);
    const { data: nonceData, error: nonceError } = await supabaseAdmin
      .from('login_nonces')
      .select('nonce, expires_at')
      .eq('address', lowerCaseAddress)
      .maybeSingle();

    if (nonceError) {
      console.error(
        `[API Verify] Database error when fetching nonce (${lowerCaseAddress}):`,
        nonceError,
      );
      return createErrorResponse('Database error when retrieving nonce', 500);
    }
    if (!nonceData) {
      console.log(`[API Verify] No nonce found for ${lowerCaseAddress}.`);
      return createErrorResponse(
        'Invalid or expired nonce, please try again.',
        403,
      );
    }
    if (new Date(nonceData.expires_at) < new Date()) {
      console.log(`[API Verify] Nonce for ${lowerCaseAddress} has expired.`);
      await supabaseAdmin
        .from('login_nonces')
        .delete()
        .match({ address: lowerCaseAddress });
      return createErrorResponse('Nonce has expired, please try again.', 403);
    }
    if (!message.includes(nonceData.nonce)) {
      console.log(
        `[API Verify] Message doesn't contain valid nonce (${nonceData.nonce}) for ${lowerCaseAddress}.`,
      );
      return createErrorResponse('Invalid nonce in signature message.', 403);
    }

    console.log(
      `[API Verify] Nonce (${nonceData.nonce}) verified, deleting...`,
    );
    await supabaseAdmin
      .from('login_nonces')
      .delete()
      .match({ address: lowerCaseAddress });

    console.log(`[API Verify] Verifying signature for ${lowerCaseAddress}...`);
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (verifyError: any) {
      console.error(
        '[API Verify] Signature verification library call failed:',
        verifyError,
      );
      return createErrorResponse(
        'Invalid signature format or verification failed',
        401,
      );
    }
    if (recoveredAddress.toLowerCase() !== lowerCaseAddress) {
      console.warn(
        `[API Verify] Address mismatch: Recovered ${recoveredAddress.toLowerCase()} != Provided ${lowerCaseAddress}`,
      );
      return createErrorResponse(
        'Signature does not match provided address',
        401,
      );
    }
    console.log(
      `[API Verify] Signature verification successful: ${lowerCaseAddress}`,
    );

    console.log(`[API Verify] Finding profile for ${lowerCaseAddress}...`);
    const { data: profile, error: findProfileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('address', lowerCaseAddress)
      .maybeSingle();

    if (findProfileError) {
      console.error(
        `[API Verify] Database error when finding profile (${lowerCaseAddress}):`,
        findProfileError,
      );
      return createErrorResponse('Database error when finding profile', 500);
    }

    let isNewUser = !profile || !profile.user_id;
    let token = null;

    if (!isNewUser) {
      const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: lowerCaseAddress,
        });
      if (linkError) {
        console.error(
          `[API Verify] Database error when generating link (${lowerCaseAddress}):`,
          linkError,
        );
        return createErrorResponse('Database error when generating link', 500);
      }
      token = linkData.properties.hashed_token;
    }

    return createSuccessResponse({ isNewUser, token });
  } catch (error: unknown) {
    console.error('Error creating nonce:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
