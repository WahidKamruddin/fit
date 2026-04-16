'use server'

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export type UploadErrorContext = {
  step: 'bg_removal' | 'upload' | 'ai_analysis' | 'db_insert' | 'unknown';
  error: string;
  fileSize?: number;
  fileType?: string;
  userId?: string;
};

/**
 * Fire-and-forget server action. Writes structured errors to server logs
 * (Netlify function logs) without blocking the client.
 *
 * Usage: logUploadError({ ... }).catch(() => {});
 */
export async function logUploadError(ctx: UploadErrorContext): Promise<void> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  console.error('[fit:upload-error]', JSON.stringify({
    ...ctx,
    userId: user.id,
    ts: new Date().toISOString(),
  }));
}
