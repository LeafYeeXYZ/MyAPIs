import type { Context } from 'hono'

type Models = {
  [key: string]: { 
    description: string, 
    type: 'textToImage' | 'imageToImage' | 'both' 
    lang: 'natural' | 'sdPrompt'
  }
}

const MODELS: Models = {
  '@cf/lykon/dreamshaper-8-lcm': { description: '☁️ DreamShaper 8 LCM', type: 'textToImage', lang: 'natural' },
  '@cf/stabilityai/stable-diffusion-xl-base-1.0': { description: '☁️ SDXL Base 1.0', type: 'textToImage', lang: 'natural' },
  '@cf/bytedance/stable-diffusion-xl-lightning': { description: '☁️ SDXL Lightning', type: 'textToImage', lang: 'natural' },
  '@hf/cagliostrolab/animagine-xl-3.1': { description: '🤗 AnimagineXL 3.1', type: 'textToImage', lang: 'sdPrompt' },
  '@hf/UnfilteredAI/NSFW-GEN-ANIME-v2': { description: '🤗 NSFWGenAnime', type: 'textToImage', lang: 'sdPrompt' },
  '@hf/black-forest-labs/FLUX.1-schnell': { description: '🤗 FLUX.1 Schnell', type: 'textToImage', lang: 'natural' },
  '@hf/black-forest-labs/FLUX.1-dev': { description: '🤗 FLUX.1 Dev', type: 'textToImage', lang: 'natural' },
  '@cf/runwayml/stable-diffusion-v1-5-img2img': { description: '☁️ StableDiffusion 1.5 Img2Img', type: 'imageToImage', lang: 'sdPrompt' },
}

export function painter_models(c: Context): Response {
  return new Response(JSON.stringify(MODELS), {
    headers: {
      'content-type': 'application/json',
    }
  })
}
