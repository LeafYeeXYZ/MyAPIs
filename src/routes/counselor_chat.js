// 系统提示语
const SYS_PROMPT = '你是一个心理咨询师, 名叫小叶子. 请你以支持的, 非指导性的方式陪伴对方, 帮助对方探索自己, 并在需要时提供帮助'

/**
 * 生成对话消息
 * @param {Context} c 上下文对象 
 * @returns {Response} 返回对话消息或错误信息
 */
export async function counselor_chat(c) {
  try {
    // 请求参数
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.CF_USER}/ai/run/@cf/qwen/qwen1.5-14b-chat-awq`
    const body = await c.req.json()
    body.messages.unshift({ role: 'system', content: SYS_PROMPT })
    // 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${c.env.CF_AI_API_KEY}`
      },
      body: JSON.stringify({
        max_tokens: 512,
        messages: body.messages,
      })
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
      return new Response('请求失败', { status: 500 })
    }
  } catch(err) {
    return new Response(err.message, { status: 500 })
  }
}