const MODELS = {
  "@cf/lykon/dreamshaper-8-lcm": { description: "☁️ DreamShaper 8 LCM", type: "textToImage", lang: "自然语言" },
  "@cf/stabilityai/stable-diffusion-xl-base-1.0": { description: "☁️ SDXL Base 1.0", type: "textToImage", lang: "自然语言" },
  "@cf/bytedance/stable-diffusion-xl-lightning": { description: "☁️ SDXL Lightning", type: "textToImage", lang: "自然语言" },
  "@hf/cagliostrolab/animagine-xl-3.1": { description: "🤗 AnimagineXL 3.1", type: "textToImage", lang: "SD 提示词" },
  "@hf/Koolchh/AnimeBoysXL-v3.0": { description: "🤗 AnimeBoysXL 3.0", type: "textToImage", lang: "SD 提示词" },
  "@hf/UnfilteredAI/NSFW-GEN-ANIME-v2": { description: "🤗 NSFWGenAnime", type: "textToImage", lang: "SD 提示词" },
  "@hf/stabilityai/stable-diffusion-2-1": { description: "🤗 StableDiffusion 2.1", type: "textToImage", lang: "SD 提示词" },
  "@cf/stabilityai/stable-diffusion-xl-turbo": { description: "☁️ SDXL Turbo", type: "both", lang: "自然语言" },
  "@cf/runwayml/stable-diffusion-v1-5-img2img": { description: "☁️ StableDiffusion 1.5 Img2Img", type: "imageToImage", lang: "自然语言" },
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
