/** 生成请求地址和请求选项 */
class PainterRequest {
  /** 判断 Cloudflare AI 的正则 */
  #cfReg = /^@cf\//
  /** 判断 Hugging Face 的正则; \@hf/ 字段会在请求时被替换为空字符串 */
  #hfReg = /^@hf\//
  /** 
   * 获取正确的请求链接和选项
   * @param {string} model 模型
   * @param {string} prompt 提示词
   * @param {object} env 环境变量
   * @returns {object} 请求地址和请求选项
   */
  constructor(model, prompt, env) {
    // 判断模型
    if (this.#cfReg.test(model)) {
      // Cloudflare
      this.url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_USER}/ai/run/${model}`
      this.options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${env.CF_AI_API_KEY}`
        },
        body: JSON.stringify({ prompt })
      }
    } else if (this.#hfReg.test(model)) {
      // Hugging Face
      this.url = `https://api-inference.huggingface.co/models/${model.replace(this.#hfReg, '')}`
      this.options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${env.HF_API_KEY}`
        },
        body: JSON.stringify({ inputs: prompt })
      }
    }
  }
}

/**
 * 生成图片
 * @param {Context} c 上下文对象 
 * @returns {Response} 返回图片或错误信息
 */
export async function painter_generate(c) {
  try {
    // 模型
    const model = c.req.query('model')
    // 提示词
    const prompt = c.req.query('prompt')
    // 请求参数和请求地址
    const { options, url } = new PainterRequest(model, prompt, c.env)
    // 发送请求
    const response = await fetch(url, options)
    // 返回结果
    return new Response(response.body, {
      headers: {
        'content-type': 'image/png',
      }
    })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}