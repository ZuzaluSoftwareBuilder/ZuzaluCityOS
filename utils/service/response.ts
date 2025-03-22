import { NextResponse } from 'next/server';

function createErrorResponse(message: string, status: number, details?: any) {
  return NextResponse.json(
    { status: 'error', error: message, ...(details && { details }) },
    { status },
  );
}

function createSuccessResponse(data?: any, message?: string, status = 200) {
  return NextResponse.json(
    { status: 'success', ...(message && { message }), ...(data && { data }) },
    { status },
  );
}

export { createErrorResponse, createSuccessResponse };
