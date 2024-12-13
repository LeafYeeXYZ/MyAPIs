import type { Context } from 'hono'
import type { ConsoleMessage } from '../console'

export async function painter_genprompt_v4(c: Context): Promise<Response> {

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'painter/genprompt',
    message: 'Painter Genprompt Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }

  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'painter/genprompt',
    message: 'Painter Genprompt Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`
    const req = await c.req.json()
    const body = {
      image: req.image,
      max_tokens: 4096,
      prompt: 'Analyze the given image and provide a detailed description. Include details about the main subject/people/characters, background, colors, composition, and mood. Ensure the description is vivid and suitable for input into a text-to-image generation model (which means it should be in one paragraph and not contain any bullet points or lists).',
    }
    // 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${c.env.CF_AI_API_KEY}`
      },
      body: JSON.stringify(body)
    })
    const result = await response.json()
    // 返回结果
    console.log(SUCCESS_MESSAGE)
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        'content-type': 'application/json',
      }
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    ERROR_MESSAGE.data!.error = message
    console.error(ERROR_MESSAGE)
    return new Response(message, { status: 500 })
  }
}