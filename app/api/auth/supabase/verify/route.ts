import { getFakeEmail } from '@/app/api/utils/common';
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
  message: z.string().min(1, 'Message is required'),
  username: z.string().optional(),
});

const generateAuthToken = async (address: string): Promise<string> => {
  const normalizedAddress = address.toLowerCase();
  const email = getFakeEmail(normalizedAddress);
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (error) {
    console.error(
      `[API Verify] Database error when generating auth token (${normalizedAddress}):`,
      error,
    );
    throw new Error(error.message);
  }

  return data.properties.hashed_token;
};

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

    const { address, signature, message, username } = validationResult.data;
    const normalizedAddress = address.toLowerCase();
    const email = getFakeEmail(normalizedAddress);

    console.log(`[API Verify] Verifying nonce for ${normalizedAddress}...`);

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

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      console.warn(
        `[API Verify] Address mismatch: Recovered ${recoveredAddress.toLowerCase()} != Provided ${normalizedAddress}`,
      );
      return createErrorResponse(
        'Signature does not match provided address',
        401,
      );
    }

    const [nonceResult, profileResult] = await Promise.all([
      supabaseAdmin
        .from('login_nonces')
        .select('nonce, expires_at')
        .eq('address', normalizedAddress)
        .maybeSingle(),
      supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('address', normalizedAddress)
        .maybeSingle(),
    ]);

    const { data: nonceData, error: nonceError } = nonceResult;
    const { data: profile, error: findProfileError } = profileResult;

    if (nonceData) {
      (async () => {
        try {
          await supabaseAdmin
            .from('login_nonces')
            .delete()
            .match({ address: normalizedAddress });
          console.log(`[API Verify] Deleted nonce for ${normalizedAddress}`);
        } catch (err) {
          console.error(`[API Verify] Error deleting nonce:`, err);
        }
      })();
    }

    if (nonceError) {
      console.error(
        `[API Verify] Database error when fetching nonce (${normalizedAddress}):`,
        nonceError,
      );
      return createErrorResponse('Database error when retrieving nonce', 500);
    }

    if (findProfileError) {
      console.error(
        `[API Verify] Database error when finding profile (${normalizedAddress}):`,
        findProfileError,
      );
      return createErrorResponse('Database error when finding profile', 500);
    }

    if (!nonceData) {
      console.log(`[API Verify] No nonce found for ${normalizedAddress}.`);
      return createErrorResponse(
        'Invalid or expired nonce, please try again.',
        403,
      );
    }

    if (new Date(nonceData.expires_at) < new Date()) {
      console.log(`[API Verify] Nonce for ${normalizedAddress} has expired.`);
      return createErrorResponse('Nonce has expired, please try again.', 403);
    }

    if (!message.includes(nonceData.nonce)) {
      console.log(
        `[API Verify] Message doesn't contain valid nonce (${nonceData.nonce}) for ${normalizedAddress}.`,
      );
      return createErrorResponse('Invalid nonce in signature message.', 403);
    }

    console.log(
      `[API Verify] Signature verification successful: ${normalizedAddress}`,
    );

    let isNewUser = !profile || !profile.user_id;

    if (!isNewUser) {
      const token = await generateAuthToken(normalizedAddress);
      return createSuccessResponse({ isNewUser, token });
    }

    console.log(
      `[API Verify] Profile not found for ${normalizedAddress}. Creating new user...`,
    );

    if (!username) {
      return createErrorResponse('Username is required for new account', 400);
    }

    const { data: newUserResponse, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        user_metadata: { wallet_address: normalizedAddress },
        email,
        email_confirm: true,
      });

    if (createUserError) {
      console.error(
        '[API Verify] Failed to create Supabase Auth user:',
        createUserError,
      );
      return createErrorResponse('Database error when creating user', 500);
    }

    if (!newUserResponse?.user) {
      return createErrorResponse('Failed to create user account', 500);
    }

    const userId = newUserResponse.user.id;
    console.log(`[API Verify] Created new Supabase Auth user: ${userId}`);

    console.log(
      `[API Verify] Creating profile record for new user ${userId}...`,
    );

    const { error: createProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        address: normalizedAddress,
        username,
      });

    if (createProfileError) {
      console.error(
        `[API Verify] Failed to create profile for user ${userId}:`,
        createProfileError,
      );
      console.log(
        `[API Verify] Rolling back: Attempting to delete orphaned Auth user ${userId}...`,
      );
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return createErrorResponse('Database error when creating profile', 500);
    }

    console.log(
      `[API Verify] Successfully created profile for new user ${userId}`,
    );

    const token = await generateAuthToken(normalizedAddress);
    return createSuccessResponse({ isNewUser, token });
  } catch (error: unknown) {
    console.error('[API Verify] Unhandled error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
