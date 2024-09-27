import type { Context } from 'hono'
import type { ConsoleMessage } from '../console'

export async function weather(c: Context): Promise<Response> {

  const location = c.req.query('location') || '101010100'

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'weather',
    message: 'Weather API Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }
  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'weather',
    message: 'Weather API Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  try {
    const res = await fetch(`https://devapi.qweather.com/v7/weather/3d?location=${location}&key=${c.env.WEATHER_API_KEY}`)
    const data = await res.json()
    console.log(SUCCESS_MESSAGE)
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    ERROR_MESSAGE.data!.error = message
    console.error(ERROR_MESSAGE)
    return new Response(message, { status: 500 })
  }
}