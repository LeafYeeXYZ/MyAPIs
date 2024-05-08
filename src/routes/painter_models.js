// 模型列表
const MODELS = {
  "@cf/lykon/dreamshaper-8-lcm": "☁️ DreamShaper 8 LCM (自然语言)",
  "@cf/stabilityai/stable-diffusion-xl-base-1.0": "☁️ StableDiffusion XL Base 1.0 (自然语言)",
  "@cf/bytedance/stable-diffusion-xl-lightning": "☁️ StableDiffusion XL Lightning (自然语言)",
  "@cf/stabilityai/stable-diffusion-xl-turbo": "☁️ StableDiffusion XL Turbo (自然语言)",
  "@hf/stabilityai/stable-diffusion-2-1": "🤗 StableDiffusion 2.1 (SD 提示词)",
  "@hf/cagliostrolab/animagine-xl-3.1": "🤗 Animagine XL 3.1 (SD 提示词)",
  "@hf/Koolchh/AnimeBoysXL-v3.0": "🤗 AnimeBoys XL v3.0 (SD 提示词)",
  "@hf/UnfilteredAI/NSFW-GEN-ANIME-v2": "🤗 NSFW Gen Anime (SD 提示词)",
  "@hf/JosefJilek/loliDiffusion": "🤗 LoliDiffusion (SD 提示词)",
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
