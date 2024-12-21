import type { Context } from 'hono'
import type { ConsoleMessage } from '../console'

export async function being_chat(c: Context): Promise<Response> {

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
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/qwen/qwen1.5-14b-chat-awq`
    const body = await c.req.json()
    // 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${c.env.CF_AI_API_KEY}`
      },
      body: JSON.stringify({
        max_tokens: 4096,
        messages: body.messages,
      })
    })
    const result = await response.json()
    // 返回结果
    if (result.success) {
      console.log(SUCCESS_MESSAGE)
      return new Response(JSON.stringify(result), {
        headers: {
          'content-type': 'application/json',
        }
      })
    } else {
      ERROR_MESSAGE.data!.error = 'POST Cloudflare AI API Failed'
      console.error(ERROR_MESSAGE)
      return new Response('请求失败', { status: 500 })
    }
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    ERROR_MESSAGE.data!.error = message
    console.error(ERROR_MESSAGE)
    return new Response(message, { status: 500 })
  }
}