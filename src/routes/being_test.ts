import type { Context } from 'hono'
import type { ConsoleMessage } from '../console'

export async function being_test(c: Context): Promise<Response> {

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'counselor/chat',
    message: 'AI Chat Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }

  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'counselor/chat',
    message: 'AI Chat Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  try {
    const data = await c.req.json()
    if (data?.msg === 'ping') {
      return Response.json({ msg: 'pong' })
    } else {
      throw new Error('Invalid Request')
    }
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    ERROR_MESSAGE.data!.error = message
    console.error(ERROR_MESSAGE)
    return new Response(message, { status: 500 })
  }
}