/**
 * Pusher — Real-time for Battle Mode
 * Gracefully handles missing/invalid credentials
 * Server: use getPusherServer()
 * Client: use getPusherClient() — browser only
 */

const isConfigured = !!(
  process.env.PUSHER_APP_ID &&
  process.env.NEXT_PUBLIC_PUSHER_KEY &&
  process.env.PUSHER_SECRET &&
  process.env.PUSHER_SECRET !== 'REPLACE_WITH_ACTUAL_PUSHER_SECRET' &&
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

export function getPusherServer() {
  if (!isConfigured) return null;
  try {
    // Dynamic require to avoid bundling in client
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
    const PusherJS = require('pusher-js');
    return new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    });
  } catch {
    return null;
  }
}

export const pusherConfigured = isConfigured;
