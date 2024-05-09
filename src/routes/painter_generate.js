'use strict'

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
   * @param {number[]} image 图片
   * @returns {object} 请求地址和请求选项
   */
  constructor(model, prompt, env, image) {
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
        body: JSON.stringify(image ? { image: image, prompt: prompt } : { prompt: prompt })
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
        body: JSON.stringify({ 
          inputs: prompt, 
          // 下面两行可能没用
          prompt: prompt,
          negative_prompt: 'lowres, bad, text, error, missing, extra, fewer, cropped, jpeg artifacts, worst quality, bad quality, watermark, bad aesthetic, unfinished, chromatic aberration, scan, scan artifacts',
          // 等到模型可用
          options: { wait_for_model: true }
        })
      }
    }
  }
}

/**
 * 生成图片
 * @param {import('hono').Context} c 上下文对象 
 * @returns {Response} 返回图片或错误信息
 */
export async function painter_generate(c) {
  try {
    // 图片
    const data = await c.req.json()
    const image = data.image
    const model = data.model
    const prompt = data.prompt
    // 请求参数和请求地址
    const { options, url } = new PainterRequest(model, prompt, c.env, image)
    // 发送请求
    const response = await fetch(url, options)
    // 返回结果
    return new Response(response.body, {
      status: response.status,
      headers: {
        'content-type': 'image/png',
      }
    })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}