import type { Context } from 'hono'

export async function weather(c: Context): Promise<Response> {
  try {
    const location = c.req.query('location') || '101010100'
    const res = await fetch(`https://devapi.qweather.com/v7/weather/3d?location=${location}&key=${c.env.WEATHER_API_KEY}`)
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (e) {
    return new Response(e instanceof Error ? e.message : 'Unkown Server Error', { status: 500 })
  }
}