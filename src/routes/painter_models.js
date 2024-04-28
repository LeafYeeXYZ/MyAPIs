// 模型列表
const MODELS = {
  "@cf/lykon/dreamshaper-8-lcm": "☁️ DreamShaper 8 LCM",
  "@cf/stabilityai/stable-diffusion-xl-base-1.0": "☁️ StableDiffusion XL Base 1.0",
  "@cf/bytedance/stable-diffusion-xl-lightning": "☁️ StableDiffusion XL Lightning",
  "@hf/stabilityai/stable-diffusion-2-1": "🤗 StableDiffusion 2.1",
  "@hf/cagliostrolab/animagine-xl-3.1": "🤗 Animagine XL 3.1",
  "@hf/UnfilteredAI/NSFW-GEN-ANIME": "🤗 NSFW Gen Anime",
  "@hf/yehiaserag/anime-pencil-diffusion": "🤗 Anime Pencil Diffusion",
  "@hf/JosefJilek/loliDiffusion": "🤗 LoliDiffusion",
}

/**
 * 获取模型列表
 * @param {Context} c 上下文对象 
 * @returns {Response} 返回模型列表
 */
export function painter_models(c) {
  return new Response(JSON.stringify(MODELS), {
    headers: {
      'content-type': 'application/json',
    }
  })
}
