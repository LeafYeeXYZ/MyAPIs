import { Context } from 'hono'

/**
 * 翻译
 * @param {Context} c 上下文对象
 * @returns {Response} 返回翻译结果
 */
export async function painter_translate(c) {
  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/meta/m2m100-1.2b`
    const body = await c.req.json()
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
    if (result.success) {
      return new Response(JSON.stringify(result), {
        headers: {
          'content-type': 'application/json',
        }
      })
    } else {
      return new Response('翻译失败', { status: 500 })
    }
  } catch(err) {
    return new Response(err.message, { status: 500 })
  }
}