// DEPRECATED: Background removal is now handled client-side via @imgly/background-removal.
// Retained for rollback. Safe to delete after client-side path is confirmed stable in prod.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const response = await fetch(`${process.env.API_URL}/remove-background`, {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.BG_REMOVER_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    return NextResponse.json(
      { error: `Background removal failed (${response.status}${text ? `: ${text}` : ''})` },
      { status: response.status }
    );
  }

  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: { 'Content-Type': 'image/png' },
  });
}
