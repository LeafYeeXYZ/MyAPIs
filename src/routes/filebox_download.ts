import type { Context } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

export async function filebox_download(c: Context): Promise<Response> {
  return new Response('Hello, World!', { status: 200 })
}