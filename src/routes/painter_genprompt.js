/**
 * 图生文接口
 * @param {import('hono').Context} c 上下文对象
 * @returns {Response} 返回生成结果
 */
export async function painter_genprompt(c) {
  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/unum/uform-gen2-qwen-500m`
    const req = await c.req.json()
    const body = {
      image: req.image,
      max_tokens: 512,
      prompt: 'Generate a detailed description in a single paragraph for this image',
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
    if (result.success) {
      return new Response(JSON.stringify(result), {
        headers: {
          'content-type': 'application/json',
        }
      })
    } else {
      return new Response('生成失败', { status: 500 })
    }
  } catch(err) {
    return new Response(err.message, { status: 500 })
  }
}