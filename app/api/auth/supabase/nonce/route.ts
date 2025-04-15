import supabaseAdmin from '@/app/api/utils/supabase';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { NextRequest } from 'next/server';
import { generateSiweNonce } from 'viem/siwe';
import { z } from 'zod';

const nonceSchema = z.object({
  address: z.string().min(1, 'Address is required'),
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
    const { address } = validationResult.data;
    const lowerCaseAddress = address.toLowerCase();

    const nonce = generateSiweNonce();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);
    const { error: storeError } = await supabaseAdmin
      .from('login_nonces')
      .upsert(
        {
          address: lowerCaseAddress,
          nonce: nonce,
          expires_at: expires_at.toISOString(),
        },
        {
          onConflict: 'address',
        },
      );

    if (storeError) {
      console.error('Error creating nonce:', storeError);
      return createErrorResponse('Internal server error', 500);
    }

    return createSuccessResponse({ nonce });
  } catch (error: unknown) {
    console.error('Error creating nonce:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
