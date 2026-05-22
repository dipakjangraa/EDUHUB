/**
 * Pusher — Real-time for Battle Mode
 * All imports are dynamic to prevent build-time crashes
 */

export function getPusherServer() {
  if (typeof window !== 'undefined') return null;
  
  const isConfigured = !!(
    process.env.PUSHER_APP_ID &&
    process.env.NEXT_PUBLIC_PUSHER_KEY &&
    process.env.PUSHER_SECRET &&
    process.env.PUSHER_SECRET !== 'REPLACE_WITH_ACTUAL_PUSHER_SECRET' &&
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER
  );

  if (!isConfigured) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Pusher = require('pusher');
    return new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });
  } catch {
    return null;
  }
}

export function getPusherClient() {
  if (typeof window === 'undefined') return null;
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PusherJS = require('pusher-js');
    return new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    });
  } catch {
    return null;
  }
}

export const pusherConfigured = !!(
  process.env.PUSHER_APP_ID &&
  process.env.PUSHER_SECRET &&
  process.env.PUSHER_SECRET !== 'REPLACE_WITH_ACTUAL_PUSHER_SECRET'
);
